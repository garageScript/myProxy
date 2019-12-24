import fetch from 'node-fetch'
import { sendRequest } from '../helpers/httpRequest'
import { getProviderKeys } from '../lib/data'
import { Provider, ServiceResponse } from '../types/general'
import { ServiceKey } from '../types/admin'
import { RequestForName } from '../types/general'
import { providerList } from './'

const provider = providerList.find(provider => provider.name === 'Name.com')
const { name, dns, keys, service } = provider

const getKeys = (): ServiceKey[] => {
  const providerKeys = keys.map(key => {
    const serviceKeys = getProviderKeys()
    return serviceKeys.find(k => k.service === dns && k.key === key) || key
  })
  return providerKeys as ServiceKey[]
}
const findKey = (key: string): string => {
  return (getKeys().find(k => k.key === key) || { value: '' }).value
}
const headers = {
  Authorization: `Basic ${Buffer.from(
    `${findKey(keys[0])}:${findKey(keys[1])}`
  ).toString('base64')}`
}

export const getDomains = async (): Promise<Provider> => {
  const keys = getKeys()
  let domains = []
  const url = `${service}/v4/domains`
  const request = await sendRequest<RequestForName>(url, { headers }).catch(
    err => {
      console.error(`getDomains Error: ${err}`)
      return { domains: [] }
    }
  )

  if (request.domains) domains = [...request.domains]

  return {
    id: dns,
    service,
    name,
    keys,
    domains: domains.map(el => ({ ...el, domain: el.domainName }))
  }
}

export const setRecord = async (
  domain: string,
  ipaddress: string
): Promise<ServiceResponse> => {
  const url = `${service}/v4/domains/${domain}/records`
  const data = {
    host: '*',
    domainName: domain,
    type: 'A',
    answer: ipaddress,
    ttl: 300
  }

  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  }

  const response: ServiceResponse = {
    success: true,
    message: 'Successfully set CNAME records for wildcard domain'
  }

  await fetch(url, options).catch(error => {
    console.error('Error setting CNAME records', error)
    response.success = false
    response.message = 'Error setting CNAME records'
  })

  return response
}
