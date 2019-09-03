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

export { Mapping, Provider }
