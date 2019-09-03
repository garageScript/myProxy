/*eslint @typescript-eslint/camelcase: 0*/
import { sendRequest } from '../helpers/httpRequest'
import { getProviderKeys } from '../api/lib/data'
import { ServiceKey } from '../api/types/admin'
import serviceConfig from '../api/serviceConfig'
import { Provider } from '../api/types/general'

export const getDomains = async (): Promise<Provider> => {
  const service = 'https://api.godaddy.com'
  const serviceKeys = getProviderKeys()
  const { name, keys } = serviceConfig['dns_gd']
  const { GD_Key, GD_Secret } = keys.reduce((acc: object, key: string) => {
    const keyValue: string = serviceKeys.find(
      (el: ServiceKey) => el.key === key
    ).value
    acc[key] = keyValue || ''
    return acc
  }, {})
  let domains = []
  const url = `${service}/v1/domains?statuses=ACTIVE`

  if (GD_Key && GD_Secret) {
    const options = {
      headers: {
        Authorization: `sso-key ${GD_Key}:${GD_Secret}`
      }
    }

    domains = await sendRequest(url, options)
  }

  return {
    id: 'dns_gd',
    service,
    name,
    keys: { GD_Key, GD_Secret },
    domains
  }
}
