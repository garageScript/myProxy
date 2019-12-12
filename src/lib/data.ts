import fs from 'fs'
import { createDomainCache, createIdCache } from '../helpers/cache'
import { DB, ServiceKey } from '../types/admin'
import { Mapping, MappingObj, Domain, AccessToken } from '../types/general'

const data: DB = {
  serviceKeys: [],
  mappings: [],
  availableDomains: [],
  accessToken: []
}

let domainToMapping: MappingObj | {} = {}
let idToMapping: MappingObj | {} = {}

const updateCache = (table: string): void => {
  if (table === 'mappings') {
    domainToMapping = createDomainCache(data.mappings)
    idToMapping = createIdCache(data.mappings)
  }
}

try {
  const file = fs.readFileSync('./data.db')
  const fileData: DB = JSON.parse(file.toString() || '{}')
  data.serviceKeys = fileData.serviceKeys || []
  data.mappings = fileData.mappings || []
  data.availableDomains = fileData.availableDomains || []
  data.accessToken = fileData.accessToken || []

  domainToMapping = createDomainCache(data.mappings)
  idToMapping = createIdCache(data.mappings)
} catch (err) {
  console.error(`Error reading from data.db on startup, ${err}`)
}

// Typescript disable, because this is meant as a helper function to be used with N number of input types
const getData = (table: string): unknown => {
  return data[table]
}

// Typescript disable, because this is meant as a helper function to be used with N number of input types
const setData = (table: string, records: unknown): void => {
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
  const initialData = getData('serviceKeys') as ServiceKey[] | undefined
  return initialData || []
}

const getMappings = (): Mapping[] => {
  const initialData = getData('mappings') as Mapping[] | undefined
  return initialData || []
}

const getAvailableDomains = (): Domain[] => {
  const initialData = getData('availableDomains') as Domain[] | undefined
  return initialData || []
}

const getAccessTokens = (): AccessToken[] => {
  const initialData = getData('apiTokens') as AccessToken[] | undefined
  return initialData || []
}

const getMappingByDomain = (domain: string): Mapping => {
  return domainToMapping[domain]
}

const getMappingById = (id: string): Mapping => {
  return idToMapping[id]
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
  deleteDomain
}
