type ServiceKey = {
  id?: number
  key: string
  value: string
  service: string
}

type DB = {
  [serviceKeys: string]: Array<ServiceKey>
}

export { ServiceKey, DB }
