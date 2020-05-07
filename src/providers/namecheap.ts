import fetch from 'node-fetch'
import { getProviderKeys } from '../lib/data'
import { Provider, ServiceResponse } from '../types/general'
import { ServiceKey } from '../types/admin'
import namecheapApi from 'namecheap-api'
import { providerList } from '.'

const provider = providerList.find(
  provider => provider.name === 'Namecheap.com'
)
const { name, dns, keys, service } = provider

const getKeys = (): ServiceKey[] => {
  const keysDefault: { key: string }[] = [{ key: keys[0] }, { key: keys[1] }]
  const providerKeys = keysDefault.map(key => {
    const serviceKeys = getProviderKeys()
    return serviceKeys.find(k => k.service === dns && k.key === key.key) || key
  })
  return providerKeys as ServiceKey[]
}
const findKey = (key: string): string => {
  return (getKeys().find(k => k.key === key) || { value: '' }).value
}

export const getDomains = async (): Promise<Provider> => {
  const providerKeys = getKeys()
  const domains = []

  const ifconfigRes = await fetch('https://ifconfig.me/ip')

  namecheapApi.config.set('ApiUser', findKey(keys[0]))
  namecheapApi.config.set('ApiKey', findKey(keys[1]))
  namecheapApi.config.set('ClientIp', await ifconfigRes.text())

  const { response } = await namecheapApi.apiCall(
    'namecheap.domains.getList',
    {}
  )

  response[0].DomainGetListResult[0].Domain.forEach(domain => {
    domains.push({ domain: domain['$'].Name })
  })

  return {
    id: dns,
    service,
    name,
    keys: providerKeys,
    domains
  }
}

export const setRecord = async (
  domain: string,
  ipaddress: string
): Promise<ServiceResponse> => {
  const response: ServiceResponse = {
    success: true,
    message: `Successfully set A records for @ and * for ${domain}`
  }

  try {
    await namecheapApi.apiCall('namecheap.domains.dns.setHosts', {
      SLD: domain.split('.')[0],
      TLD: domain.split('.')[1],
      HostName1: '@',
      RecordType1: 'A',
      Address1: ipaddress,
      HostName2: '*',
      RecordType2: 'A',
      Address2: ipaddress
    })
  } catch (err) {
    response.success = false
    response.message = `Error setting A records for ${domain}`
  }

  return response
}
