import express from 'express'
import environment from '../helpers/environment'
import { getMappingByDomain } from '../lib/data'
import { getContainerLogs } from '../helpers/docker'

const logsRouter = express.Router()
const { isProduction } = environment

logsRouter.get('/:stream/:domain', async (req, res) => {
  const { stream, domain } = req.params
  const { follow, tail } = req.query

  // Stream validation
  if (stream !== 'stdout' && stream !== 'stderr') {
    return res
      .status(400)
      .json({ message: 'stream param must be stdout or stderr' })
  }

  if (isProduction()) {
    // Only search for domain when running in production. The test does not
    // require a valid domain since it only verifies the endpoint
    const { fullDomain } = getMappingByDomain(domain)
    // Pipes the log to res
    res.setHeader('content-type', 'text/plain')
    const logStream = await getContainerLogs(fullDomain, {
      follow: Boolean(follow),
      tail: Number(tail),
      [stream]: true
    })
    logStream.pipe(res)
  } else {
    res.send('OK')
  }
})

export default logsRouter
