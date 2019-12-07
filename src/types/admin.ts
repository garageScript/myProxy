import { Mapping, Domain } from './general'

type ServiceKey = {
  id?: string
  key: string
  value: string
  service: string
}

type DB = {
  serviceKeys: ServiceKey[]
  mappings: { string?: Mapping }
  availableDomains: Domain[]
}

export { ServiceKey, DB }
