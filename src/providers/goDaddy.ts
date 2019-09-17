import { sendRequest } from '../helpers/httpRequest'
import { getProviderKeys } from '../lib/data'
import { Provider, ServiceResponse } from '../types/general'
import { ServiceKey } from '../types/admin'

const NAME = 'Godaddy'
const SERVICE = 'https://api.godaddy.com'

const getKeys = (): ServiceKey[] => {
  const keysDefault: { key: string }[] = [
    { key: 'GD_Key' },
    { key: 'GD_Secret' }
  ]
  const keys = keysDefault.map(keyInfo => {
    const serviceKeys = getProviderKeys()
    return (
      serviceKeys.find(k => k.service === 'dns_gd' && k.key === keyInfo.key) ||
      keyInfo
    )
  })
  return keys as ServiceKey[]
}
const findKey = (key: string): string => {
  return (getKeys().find(k => k.key === key) || { value: '' }).value
}

export const getDomains = async (): Promise<Provider> => {
  const keys = getKeys()
  let domains = []
  const url = `${SERVICE}/v1/domains?statuses=ACTIVE`
  const options = {
    headers: {
      Authorization: `sso-key ${findKey('GD_Key')}:${findKey('GD_Secret')}`,
      'Content-Type': 'application/json'
    }
  }

  domains = await sendRequest<Array<unknown>>(url, options)

  return {
    id: 'dns_gd',
    service: SERVICE,
    name: NAME,
    keys,
    domains
  }
}

export const setRecord = async (
  domain: string,
  ipaddress: string
): Promise<ServiceResponse> => {
  const url = `${SERVICE}/v1/domains/${domain}/records`
  const data = [
    {
      data: ipaddress,
      name: domain,
      type: 'A'
    },
    {
      data: '@',
      name: '*',
      type: 'CNAME'
    },
    {
      data: "ns01.domaincontrol.com",
      name: "",
      type: "NS"
    },
    {
      daa: "ns02.domaincontrol.com",
      name: "",
      type: "NS"
    }
  ]

  const options = {
    method: 'PUT',
    headers: {
      Authorization: `sso-key ${findKey('GD_Key')}:${findKey('GD_Secret')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  const response: ServiceResponse = {
    success: true,
    message: 'Successfully set CNAME records for wildcard domain'
  }
  try {
    await sendRequest<Array<unknown>>(url, options)
  } catch (e) {
    console.error('Error setting API', e)
    response.success = false
    response.message = 'Error setting API'
  }
  return response
}
