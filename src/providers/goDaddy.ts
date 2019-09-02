import { sendRequest } from '../helpers/httpRequest'
import { getData } from '../api/lib/data'
import { ServiceKey } from '../api/types/admin'

export const getDomains = () => {
  const serviceKeys: any = getData('serviceKeys')
  const { service, value: key } = serviceKeys.find(
    (el: ServiceKey) => el.key === 'GD_Key'
  )
  const { value: secret } = serviceKeys.find(
    (el: ServiceKey) => el.key === 'GD_Secret'
  )
  const url = `${service}/v1/domains?statuses=ACTIVE`
  const options = { headers: { Authorization: `sso-key ${key}:${secret}` } }

  return sendRequest(url, options)
}
