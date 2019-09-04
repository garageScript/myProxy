type Mapping = {
  domain: string
  port: string
  ip: string
  id: string
}

type Provider = {
  id: string
  service: string
  name: string
  keys: object
  domains: object[]
}

type Domain = {
  domain: string
  expiration: string
  provider: string
}

export { Mapping, Provider, Domain }
