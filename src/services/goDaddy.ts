const KEY = process.env.KEY
const SECRET = process.env.SECRET

export default {
  service: 'https://api.godaddy.com',
  getDomains: '/v1/domains?statuses=ACTIVE',
  options: { headers: { Authorization: `sso-key ${KEY}:${SECRET}` } }
}
