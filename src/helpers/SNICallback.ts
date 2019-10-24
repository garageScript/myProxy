// escape characters required or readFileSync will not find file
/* eslint-disable */
import fs from 'fs'
import tls from 'tls'
import util from 'util'

import environment from '../helpers/environment'

const { HOME } = environment
const acmePath = `${HOME}/\.acme\.sh`
const readFileAsync = util.promisify(fs.readFile)

const readFile = async (path: string) => {
  const data = await readFileAsync(path).catch(e => {
    console.log('readFile ERR', e)
  })
  console.log(`🔥: readFile -> data`, data)
  return data || null
}

const SNICallback = async (host, cb) => {
  const filteredHost = host.split('.')
  console.log(`🔥: filteredHost`, filteredHost)
  const [domain, topLevelDomain] = filteredHost.slice(
    filteredHost.length - 2,
    filteredHost.length
  )
  const filteredDomain = `${domain}.${topLevelDomain}`
  const hasWildStar = filteredHost.length >= 2 ? '*' : ''
  const certPath = `${acmePath}/${hasWildStar}${filteredDomain}/fullchain.cer`
  const keyPath = `${acmePath}/${hasWildStar}\.${filteredDomain}/${hasWildStar}\.${filteredDomain}\.key`

  console.log({ certPath, keyPath })

  const key = await readFile(keyPath)
  const cert = await readFile(certPath)

  console.log({ key, cert })

  const secureContext = tls.createSecureContext({ key, cert })
  if (cb) return cb(null, secureContext)
  return secureContext
}

export { SNICallback }
