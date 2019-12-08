import { Mapping, Domain, ApiTokens } from './general'

type ServiceKey = {
  id?: string
  key: string
  value: string
  service: string
}

type DB = {
  serviceKeys: ServiceKey[]
  mappings: Mapping[]
  availableDomains: Domain[]
  apiTokens: ApiTokens[]
}

export { ServiceKey, DB }
