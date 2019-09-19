type Mapping = {
  domain: string
  subDomain: string
  port: string
  ip: string
  id: string
}

type Provider = {
  id: string
  service: string
  name: string
  keys: object
  domains: unknown
}

type Domain = {
  domain: string
  expiration: string
  provider: string
}

type ServiceResponse = {
  success: boolean
  message: string
}

type ProviderService = {
  getDomains: Function
  setRecord: Function
}

type ServiceConfig = {
  dns_gd: ProviderService
}

type NameServer = {
  data: string
  name: string
  ttl: number
  type: string
}

export {
  Mapping,
  Provider,
  Domain,
  ServiceResponse,
  ServiceConfig,
  ProviderService,
  NameServer
}
