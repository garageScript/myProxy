/*eslint @typescript-eslint/camelcase: 0*/
import { sendRequest } from '../helpers/httpRequest'
import { getProviderKeys } from '../api/lib/data'
import { Provider } from '../api/types/general'

export const getDomains = async (): Promise<Provider> => {
  const service = 'https://api.godaddy.com'
  const name = 'Godaddy'
  const serviceKeys = getProviderKeys()

  const defaultKey = { value: '' }
  const GD_Key = (serviceKeys.find(el => el.key === 'GD_Key') || defaultKey)
    .value
  const GD_Secret = (
    serviceKeys.find(el => el.key === 'GD_Secret') || defaultKey
  ).value

  let domains = []
  const url = `${service}/v1/domains?statuses=ACTIVE`

  if (GD_Key && GD_Secret) {
    const options = {
      headers: {
        Authorization: `sso-key ${GD_Key}:${GD_Secret}`
      }
    }

    // eslint-disable-next-line
    try {
      domains = await sendRequest<Array<any>>(url, options)
    } catch (e) {
      console.log('error', e)
    }
  }

  const keysDefault = [{
    key: "GD_Key",
  }, {
    key: "GD_Secret",
  }]

  const keys = keysDefault.map( keyInfo => {
    const storedKey = serviceKeys.find(k => k.service === 'dns_gd' && k.key === keyInfo.key)
    if (storedKey) {
      return storedKey
    }
    return keyInfo
  })

  return {
    id: 'dns_gd',
    service,
    name,
    keys,
    domains
  }
}
