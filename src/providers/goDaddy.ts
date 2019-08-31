/*eslint @typescript-eslint/camelcase: 0*/
import { sendRequest } from '../helpers/httpRequest'
import { getData } from '../api/lib/data'
import { ServiceKey } from '../api/types/admin'
import serviceConfig from '../api/serviceConfig'

export const getDomains = async () => {
  const serviceKeys = getData('serviceKeys')
  const { name, keys, service } = serviceConfig['dns_gd']
  const { GD_Key, GD_Secret } = keys.reduce((acc: object, key: string) => {
    acc[key] = serviceKeys.find((el: ServiceKey) => el.key === key).value
    return acc
  }, {})
  const url = `${service}/v1/domains?statuses=ACTIVE`
  const options = {
    headers: {
      Authorization: `sso-key ${GD_Key}:${GD_Secret}`
    }
  }
  const domains = await sendRequest(url, options)

  return {
    id: 'dns_gd',
    service,
    name,
    keys: { GD_Key, GD_Secret },
    domains
  }
}
