import fetch from '../helpers/httpRequest'
import { getData } from '../api/lib/data'

const KEY = getData('serviceKeys').key
const SECRET = getData('serviceKeys').secret
const SERVICE = 'https://api.godaddy.com'
const ACTIVE_DOMAINS = `${SERVICE}/v1/domains?statuses=ACTIVE`
const OPTIONS = { headers: { Authorization: `sso-key ${KEY}:${SECRET}` } }

export const getDomains = () => fetch(ACTIVE_DOMAINS, OPTIONS)
