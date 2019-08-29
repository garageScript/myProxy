import fetch from '../helpers/httpRequest'
import { getData } from '../api/lib/data'

export const getDomains = () => {
  const serviceKeys: any = getData('serviceKeys')
  const { service, value: key } = serviceKeys.find(
    (el: { key: string }) => el.key === 'GD_Key'
  )
  const { value: secret } = serviceKeys.find(
    (el: { key: string }) => el.key === 'GD_Secret'
  )
  const url = `${service}/v1/domains?statuses=ACTIVE`
  const options = { headers: { Authorization: `sso-key ${key}:${secret}` } }

  return fetch(url, options)
}
