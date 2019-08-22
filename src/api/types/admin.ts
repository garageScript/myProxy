type ServiceKey = {
  id?: string,
  key: string, 
  value: string,
  service: string
}

type DB = {
  serviceKeys: Array<ServiceKey>
}

export {
  ServiceKey,
  DB
}
