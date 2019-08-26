import fetch from '../helpers/httpRequest'

const KEY = process.env.API_KEY_GO_DADDY
const SECRET = process.env.SECRET_GO_DADDY
const SERVICE = 'https://api.godaddy.com'
const ACTIVE_DOMAINS = `${SERVICE}/v1/domains?statuses=ACTIVE`
const OPTIONS = { headers: { Authorization: `sso-key ${KEY}:${SECRET}` } }

export const getDomains = () => fetch(ACTIVE_DOMAINS, OPTIONS)
