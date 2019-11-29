import cp from 'child_process'
import express from 'express'
import util from 'util'

const statusRouter = express.Router()
const exec = util.promisify(cp.exec)

statusRouter.get('/', async (req, res) => {
  try {
    const data = await exec('su - myproxy -c "pm2 jlist"')
    res.send(data)
  } catch (err) {
    res.status(500).send({ err })
  }
})

export default statusRouter
