type Mapping = {
  domain: string
  subDomain: string
  port: string
  ip: string
  id: string
  gitLink: string
  fullDomain: string
}

type MappingById = {
  [mappingId: string]: Mapping
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

type ProxyMapping = {
  ip?: string
  port?: string
}

type AccessToken = {
  name?: string
  id?: string
}

export {
  Mapping,
  MappingById,
  Provider,
  Domain,
  ServiceResponse,
  ServiceConfig,
  ProviderService,
  ProxyMapping,
  AccessToken
}
