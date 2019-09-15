import { Mapping, Domain } from './general'

type ServiceKey = {
  id?: string
  key: string
  value: string
  service: string
}

type DB = {
  serviceKeys: Array<ServiceKey>,
  mappings: Array<Mapping>,
  availableDomains: Array<Domain>,
}

export { ServiceKey, DB }
