type Mappings = {
  domain: string
  port: string
  ip: string
  id: string
}

type DB = {
  [mappings: string]: Array<Mappings>
}
