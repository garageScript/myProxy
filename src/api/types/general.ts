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
  // eslint-disable-next-line
  domains: any
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

export { Mapping, Provider, Domain, ServiceResponse, ProviderService }
