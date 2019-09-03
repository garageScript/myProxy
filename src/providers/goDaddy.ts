/*eslint @typescript-eslint/camelcase: 0*/
import { sendRequest } from '../helpers/httpRequest'
import { getProviderKeys } from '../api/lib/data'
import { ServiceKey } from '../api/types/admin'
import serviceConfig from '../api/serviceConfig'
import { Provider } from '../api/types/general'

export const getDomains = async (): Promise<Provider> => {
  const service = 'https://api.godaddy.com'
  const serviceKeys = getProviderKeys()

  const defaultKey = { value: '' }
  const GD_Key = (serviceKeys.find(el => el.key === 'GD_Key') || defaultKey).value
  const GD_Secret = (serviceKeys.find(el => el.key === 'GD_Secret') || defaultKey).value

  let domains = []
  const url = `${service}/v1/domains?statuses=ACTIVE`

  if (GD_Key && GD_Secret) {
    const options = {
      headers: {
        Authorization: `sso-key ${GD_Key}:${GD_Secret}`
      }
    }

    domains = await sendRequest<Array<any>>(url, options)
  }

  return {
    id: 'dns_gd',
    service,
    name,
    keys: { GD_Key, GD_Secret },
    domains
  }
}
