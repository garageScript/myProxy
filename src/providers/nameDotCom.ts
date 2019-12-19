import fetch from 'node-fetch'
import { sendRequest } from '../helpers/httpRequest'
import environment from '../helpers/environment'
import { getProviderKeys } from '../lib/data'
import { Provider, ServiceResponse } from '../types/general'
import { ServiceKey } from '../types/admin'
import { RequestForName } from '../types/general'

const { isProduction } = environment
const NAME = 'Name.com'
const SERVICE = isProduction
  ? 'https://api.name.com'
  : 'https://api.dev.name.com'

const getKeys = (): ServiceKey[] => {
  const keysDefault: { key: string }[] = [
    { key: 'NAME_Key' },
    { key: 'NAME_Secret' }
  ]
  const keys = keysDefault.map(keyInfo => {
    const serviceKeys = getProviderKeys()
    return (
      serviceKeys.find(
        k => k.service === 'dns_namecom' && k.key === keyInfo.key
      ) || keyInfo
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
  const url = `${SERVICE}/v4/domains`
  const options = {
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${findKey('NAME_Key')}:${findKey('NAME_Secret')}`
      ).toString('base64')}`
    }
  }

  const request = await sendRequest<RequestForName>(url, options).catch(err => {
    console.error(`getDomains Error: ${err}`)
    return { domains: [] }
  })

  if (request.domains) domains = [...request.domains]

  return {
    id: 'dns_namecom',
    service: SERVICE,
    name: NAME,
    keys,
    domains: domains.map(el => ({ ...el, domain: el.domainName }))
  }
}

export const setRecord = async (
  domain: string,
  ipaddress: string
): Promise<ServiceResponse> => {
  const url = `${SERVICE}/v4/domains/${domain}/records`
  const data = [
    {
      domainName: domain,
      type: 'A',
      answer: ipaddress,
      ttl: 300
    }
  ]
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${findKey('NAME_Key')}:${findKey('NAME_Secret')}`
      ).toString('base64')}`
    },
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
