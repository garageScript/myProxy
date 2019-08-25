type ServiceKey = {
  id?: string
  key: string
  value: string
  service: string
}

type DB = {
  [serviceKeys : string] : Array<ServiceKey>
}

export { ServiceKey, DB }
