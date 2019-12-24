import { sendRequest } from '../helpers/httpRequest'
import { getProviderKeys } from '../lib/data'
import { Provider, ServiceResponse } from '../types/general'
import { ServiceKey } from '../types/admin'
import fetch from 'node-fetch'
import { providerList } from './'

const provider = providerList.find(provider => provider.name === 'GoDaddy')
const { name, dns, keys, service } = provider

const getKeys = (): ServiceKey[] => {
  const keysDefault: { key: string }[] = [{ key: keys[0] }, { key: keys[1] }]
  const providerKeys = keysDefault.map(keyInfo => {
    const serviceKeys = getProviderKeys()
    return (
      serviceKeys.find(k => k.service === dns && k.key === keyInfo.key) ||
      keyInfo
    )
  })
  return providerKeys as ServiceKey[]
}
const findKey = (key: string): string => {
  return (getKeys().find(k => k.key === key) || { value: '' }).value
}
const headers = {
  Authorization: `sso-key ${findKey(keys[0])}:${findKey(keys[1])}`,
  'Content-Type': 'application/json'
}

export const getDomains = async (): Promise<Provider> => {
  const keys = getKeys()
  let domains = []
  const url = `${service}/v1/domains?statuses=ACTIVE`
  domains = await sendRequest<Array<unknown>>(url, { headers })

  return {
    id: dns,
    service,
    name,
    keys,
    domains
  }
}

export const setRecord = async (
  domain: string,
  ipaddress: string
): Promise<ServiceResponse> => {
  const url = `${service}/v1/domains/${domain}/records/A/@`
  const data = [
    {
      data: ipaddress,
      ttl: 600
    }
  ]
  const options = {
    method: 'PUT',
    headers,
    body: JSON.stringify(data)
  }
  const cnameUrl = `${service}/v1/domains/${domain}/records/CNAME/*`
  const cnameData = [
    {
      data: '@',
      ttl: 600
    }
  ]
  const cnameOptions = {
    method: 'PUT',
    headers,
    body: JSON.stringify(cnameData)
  }
  const response: ServiceResponse = {
    success: true,
    message: 'Successfully set CNAME records for wildcard domain'
  }

  // eslint-disable-next-line
  await Promise.all([fetch(url, options), fetch(cnameUrl, cnameOptions)]).catch(
    error => {
      console.error('Error setting CNAME records', error)
      response.success = false
      response.message = 'Error setting CNAME records'
    }
  )

  return response
}
