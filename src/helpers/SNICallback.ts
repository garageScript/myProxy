// escape characters required or readFileSync will not find file
/* eslint-disable */
import fs from 'fs'
import tls from 'tls'
import util from 'util'

import environment from '../helpers/environment'

const { HOME } = environment
const acmePath = `${HOME}/.acme.sh`
const readFileAsync = util.promisify(fs.readFile)

const readFile = async (path: string) => {
  const data = await readFileAsync(path, 'utf8')
  return data || null
}

const SNICallback = async (host, cb) => {
  // TLD -> Top-Level Domain | SLD -> Second-Level Domain
  const [TLD, SLD, ...subDomains] = host.split('.').reverse()
  const domain = `${SLD}.${TLD}`
  const wildstar = subDomains.length > 0 ? '*' : ''
  const keyPath = `${acmePath}/${wildstar}.${domain}/${wildstar}.${domain}\.key`
  const certPath = `${acmePath}/${wildstar}.${domain}/fullchain.cer`
  const key = await readFile(keyPath)
  const cert = await readFile(certPath)
  const secureContext = tls.createSecureContext({ key, cert })
  if (cb) return cb(null, secureContext)
  return secureContext
}

export { SNICallback }
