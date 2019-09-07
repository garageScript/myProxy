/*eslint @typescript-eslint/camelcase: 0*/
import { sendRequest } from '../helpers/httpRequest'
import { getProviderKeys } from '../api/lib/data'
import { Provider } from '../api/types/general'

const service = 'https://api.godaddy.com'
const getKeys = (): { GD_Key: string; GD_Secret: string } => {
  const serviceKeys = getProviderKeys()
  const defaultKey = { value: '' }
  const GD_Key = (serviceKeys.find(el => el.key === 'GD_Key') || defaultKey)
    .value
  const GD_Secret = (
    serviceKeys.find(el => el.key === 'GD_Secret') || defaultKey
  ).value

  return { GD_Key, GD_Secret }
}

export const getDomains = async (): Promise<Provider> => {
  const name = 'Godaddy'
  const { GD_Key, GD_Secret } = getKeys()

  let domains = []
  const url = `${service}/v1/domains?statuses=ACTIVE`

  if (GD_Key && GD_Secret) {
    const options = {
      headers: {
        Authorization: `sso-key ${GD_Key}:${GD_Secret}`,
        'Content-Type': 'application/json'
      }
    }

    try {
      // eslint-disable-next-line
      domains = await sendRequest<Array<any>>(url, options)
    } catch (e) {
      console.log('error', e)
    }
  }

  const keysDefault = [
    {
      key: 'GD_Key'
    },
    {
      key: 'GD_Secret'
    }
  ]

  const keys = keysDefault.map(keyInfo => {
    const serviceKeys = getProviderKeys()
    const storedKey = serviceKeys.find(
      k => k.service === 'dns_gd' && k.key === keyInfo.key
    )
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

export const setRecord = async (domain: string, ipaddress: string) => {
  const serviceKeys = getProviderKeys()
  const defaultKey = { value: '' }
  const GD_Key = (serviceKeys.find(el => el.key === 'GD_Key') || defaultKey)
    .value
  const GD_Secret = (
    serviceKeys.find(el => el.key === 'GD_Secret') || defaultKey
  ).value

  let setRecord = []
  const url = `${service}/v1/domains/${domain}/records`
  const data = [
    {
      data: '167.71.153.58',
      name: 'TEST_A',
      type: 'A'
    },
    {
      data: 'innout.life',
      name: 'TEST_CNAME',
      type: 'CNAME'
    }
  ]

  if (GD_Key && GD_Secret) {
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: `sso-key ${GD_Key}:${GD_Secret}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    setRecord = await sendRequest<Array<any>>(url, options)
    return setRecord
  }
}
