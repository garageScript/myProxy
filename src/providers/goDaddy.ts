import { sendRequest } from '../helpers/httpRequest'
import { getProviderKeys } from '../lib/data'
import { Provider, ServiceResponse } from '../types/general'
import { ServiceKey } from '../types/admin'
import { GoDaddy } from '../constants/providers'
import fetch from 'node-fetch'

const { NAME, DNS_API, PRIMARY_KEY, SECONDARY_KEY, SERVICE } = GoDaddy

const getKeys = (): ServiceKey[] => {
  const keysDefault: { key: string }[] = [
    { key: PRIMARY_KEY },
    { key: SECONDARY_KEY }
  ]
  const keys = keysDefault.map(keyInfo => {
    const serviceKeys = getProviderKeys()
    return (
      serviceKeys.find(k => k.service === DNS_API && k.key === keyInfo.key) ||
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
      Authorization: `sso-key ${findKey(PRIMARY_KEY)}:${findKey(
        SECONDARY_KEY
      )}`,
      'Content-Type': 'application/json'
    }
  }

  domains = await sendRequest<Array<unknown>>(url, options)

  return {
    id: DNS_API,
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
      ttl: 600
    }
  ]
  const options = {
    method: 'PUT',
    headers: {
      Authorization: `sso-key ${findKey(PRIMARY_KEY)}:${findKey(
        SECONDARY_KEY
      )}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  const cnameUrl = `${SERVICE}/v1/domains/${domain}/records/CNAME/*`
  const cnameData = [
    {
      data: '@',
      ttl: 600
    }
  ]
  const cnameOptions = {
    method: 'PUT',
    headers: {
      Authorization: `sso-key ${findKey(PRIMARY_KEY)}:${findKey(
        SECONDARY_KEY
      )}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cnameData)
  }
  const response: ServiceResponse = {
    success: true,
    message: 'Successfully set CNAME records for wildcard domain'
  }
  try {
    // eslint-disable-next-line
    const results = await Promise.all([
      fetch(url, options),
      fetch(cnameUrl, cnameOptions)
    ])
  } catch (e) {
    console.error('Error setting CNAME records', e)
    response.success = false
    response.message = 'Error setting CNAME records'
  }
  return response
}
