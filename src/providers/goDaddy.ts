import fetch from 'node-fetch'
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
  let url = `${SERVICE}/v1/domains/${domain}/records/A/@`

  let options = {
    method: 'PUT',
    headers: {
      Authorization: `sso-key ${findKey('GD_Key')}:${findKey('GD_Secret')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([ { data: '167.71.153.99', name: '@', ttl: 600, type: 'A' }])
  }

  const response: ServiceResponse = {
    success: true,
    message: 'Successfully set CNAME records for wildcard domain'
  }
  try {
    const response = await fetch(url, options)
  } catch (e) {
    console.error('Error setting API', e)
    response.success = false
    response.message = 'Error setting API'
  }




  url = `${SERVICE}/v1/domains/${domain}/records/CNAME/www`

  const options2 = {
    method: 'PUT',
    headers: {
      Authorization: `sso-key ${findKey('GD_Key')}:${findKey('GD_Secret')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([ { data: '@', name: '*', ttl: 3600, type: 'CNAME' }])
  }
  console.log('sending')
  try {
  const response2 = await fetch(url, options2)
  console.log('res2222', response2)
  } catch(errr) {
    console.log('error', errr)
  }

  return response
}
