import { ProviderInfo } from '../types/general'
import { getProviderKeys } from '../lib/data'
import { ServiceKey } from '../types/admin'

export const getKeys = (provider: ProviderInfo): ServiceKey[] => {
  const { dns, keys } = provider
  const keysDefault: { key: string }[] = [{ key: keys[0] }, { key: keys[1] }]
  const providerKeys = keysDefault.map(key => {
    const serviceKeys = getProviderKeys()
    return serviceKeys.find(k => k.service === dns && k.key === key.key) || key
  })
  return providerKeys as ServiceKey[]
}

export const findKey = (provider: ProviderInfo, key: string): string => {
  return (getKeys(provider).find(k => k.key === key) || { value: '' }).value
}
