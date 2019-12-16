import fs from 'fs'
import { mapById, mapByDomain } from '../helpers/cache'
import { DB, ServiceKey } from '../types/admin'
import {
  Mapping,
  MappingById,
  Domain,
  AccessToken,
  TokenById
} from '../types/general'

const data: DB = {
  serviceKeys: [],
  mappings: [],
  availableDomains: [],
  accessTokens: []
}

let domainToMapping: MappingById = {}
let idToMapping: MappingById = {}
let idToAccessToken: TokenById = {}

const updateCache = (table: keyof DB): void => {
  if (table === 'mappings') {
    domainToMapping = mapByDomain(data.mappings)
    idToMapping = mapById(data.mappings)
  }
  if (table === 'accessTokens') {
    idToAccessToken = mapById(data.accessTokens)
  }
}

try {
  const file = fs.readFileSync('./data.db')
  const fileData: DB = JSON.parse(file.toString() || '{}')
  data.serviceKeys = fileData.serviceKeys || []
  data.mappings = fileData.mappings || []
  data.availableDomains = fileData.availableDomains || []
  data.accessTokens = fileData.accessTokens || []

  domainToMapping = mapByDomain(data.mappings)
  idToMapping = mapById(data.mappings)
} catch (err) {
  console.log(
    'File does not exist, but do not worry. File will be created on first save',
    err
  )
}

const getData = <T extends keyof DB>(table: T): DB[T] | undefined => {
  return data[table]
}

const setData = <T extends keyof DB>(table: T, records: DB[T]): void => {
  data[table] = records
  updateCache(table)

  const fileData = `${JSON.stringify(data, null, 2)}`

  fs.writeFile('./data.db', fileData, err => {
    if (err) {
      return console.log('writing to DB failed', err)
    }
  })
}

const getProviderKeys = (): ServiceKey[] => {
  const initialData = getData('serviceKeys')
  return initialData || []
}

const getMappings = (): Mapping[] => {
  const initialData = getData('mappings')
  return initialData || []
}

const getAvailableDomains = (): Domain[] => {
  const initialData = getData('availableDomains')
  return initialData || []
}

const getAccessTokens = (): AccessToken[] => {
  const initialData = getData('accessTokens')
  return initialData || []
}

const getMappingByDomain = (domain: string): Mapping => {
  return domainToMapping[domain]
}

const getMappingById = (id: string): Mapping | undefined => {
  return idToMapping[id]
}

const getTokenById = (id: string): AccessToken | undefined => {
  return idToAccessToken[id]
}

const deleteDomain = (domain: string): void => {
  delete domainToMapping[domain]
  setData('mappings', Object.values(domainToMapping))
}

export {
  getData,
  setData,
  getProviderKeys,
  getMappings,
  getAvailableDomains,
  getAccessTokens,
  getMappingByDomain,
  getMappingById,
  getTokenById,
  deleteDomain
}
