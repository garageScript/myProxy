import fetch from 'node-fetch'
import { sendRequest } from '../helpers/httpRequest'
import { Provider, ServiceResponse } from '../types/general'
import { RequestForName } from '../types/general'
import { providerList } from './'
import { getKeys, findKey } from './helpers'

const provider = providerList.find(provider => provider.name === 'Name.com')

const { name, dns, keys, service } = provider

export const getDomains = async (): Promise<Provider> => {
  const providerKeys = getKeys(provider)
  let domains = []
  const options = {
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${findKey(provider, keys[0])}:${findKey(provider, keys[1])}`
      ).toString('base64')}`
    }
  }
  const url = `${service}/v4/domains`
  const request = await sendRequest<RequestForName>(url, options).catch(err => {
    console.error(`getDomains Error: ${err}`)
    return { domains: [] }
  })

  if (request.domains) domains = [...request.domains]

  return {
    id: dns,
    service,
    name,
    keys: providerKeys,
    domains: domains.map(el => ({ ...el, domain: el.domainName }))
  }
}

export const setRecord = async (
  domain: string,
  ipaddress: string
): Promise<ServiceResponse> => {
  const url = `${service}/v4/domains/${domain}/records`
  const rootHost = {
    host: '',
    domainName: domain,
    type: 'A',
    answer: ipaddress,
    ttl: 300
  }
  const subdomainHost = {
    host: '*',
    domainName: domain,
    type: 'A',
    answer: ipaddress,
    ttl: 300
  }

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${findKey(provider, keys[0])}:${findKey(provider, keys[1])}`
      ).toString('base64')}`
    }
  }

  const rootHostOptions = {
    ...options,
    body: JSON.stringify(rootHost)
  }

  const subdomainHostOptions = {
    ...options,
    body: JSON.stringify(subdomainHost)
  }

  const response: ServiceResponse = {
    success: true,
    message: 'Successfully set CNAME records for wildcard domain'
  }

  await Promise.all([
    fetch(url, rootHostOptions),
    fetch(url, subdomainHostOptions)
  ]).catch(error => {
    console.error('Error setting CNAME records', error)
    response.success = false
    response.message = 'Error setting CNAME records'
  })

  return response
}
