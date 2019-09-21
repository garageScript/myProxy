import { sendRequest } from '../helpers/httpRequest'
import { getProviderKeys } from '../lib/data'
import { Provider, ServiceResponse } from '../types/general'
import { ServiceKey } from '../types/admin'
import fetch from 'node-fetch'

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
  const url = `${SERVICE}/v1/domains/${domain}/records/A/@`
  const data = [
    {
      data: ipaddress,
      ttl: 6000
    }
  ]
  console.log('data', data)
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
    const aResponse = await fetch(url, options)
    console.log('Aresponse', aResponse)
  } catch (e) {
    console.error('Error setting A records', e)
    response.success = false
    response.message = 'Error setting A records'
  }
  const cnameURL = `${SERVICE}/v1/domains/${domain}/records/CNAME/*`
  const cnameData = [
    {
      data: '@',
      ttl: 6000
    }
  ]
  const cnameOptions = {
    method: 'PUT',
    headers: {
      Authorization: `sso-key ${findKey('GD_Key')}:${findKey('GD_Secret')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cnameData)
  
  }
  try {
    const CNAMEresponse = await fetch(cnameURL, cnameOptions)
    console.log('CNAME', CNAMEresponse)
  } catch (e) {
    console.error('Error setting CNAME records', e)
    response.success = false
    response.message = 'Error setting CNAME records'
  }
  return response
}
