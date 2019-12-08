import fs from 'fs'
import { createDomainCache, createIdCache } from '../helpers/cache'
import { DB, ServiceKey } from '../types/admin'
import { Mapping, MappingObj, Domain } from '../types/general'

const data: DB = {
  serviceKeys: [],
  mappings: [],
  availableDomains: []
}

let mappingsCache: MappingObj | {} = {}
let mappingsDict: MappingObj | {} = {}

fs.readFile('./data.db', (err, file) => {
  if (err) {
    return console.log(
      'File does not exist, but do not worry. File will be created on first save',
      err
    )
  }
  const fileData: DB = JSON.parse(file.toString() || '{}')
  data.serviceKeys = fileData.serviceKeys || []
  data.mappings = fileData.mappings || []
  data.availableDomains = fileData.availableDomains || []

  mappingsCache = createDomainCache(data.mappings)
  mappingsDict = createIdCache(data.mappings)
})

// Typescript disable, because this is meant as a helper function to be used with N number of input types
const getData = (table: string): unknown => {
  return data[table]
}

// Typescript disable, because this is meant as a helper function to be used with N number of input types
const setData = (table: string, records: unknown): void => {
  data[table] = records
  if (table === 'mappings') {
    mappingsCache = createDomainCache(data.mappings)
    mappingsDict = createIdCache(data.mappings)
  }

  const fileData = `${JSON.stringify(data, null, 2)}`

  fs.writeFile('./data.db', fileData, err => {
    if (err) {
      return console.log('writing to DB failed', err)
    }
    console.log('successfully wrote to DB')
  })

  data[table] = records
  if (table === 'mappings') {
    mappingsCache = createDomainCache(data.mappings)
    mappingsDict = createIdCache(data.mappings)
  }
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

const domainToMapping = (domain: string): Mapping => {
  return mappingsCache[domain]
}

const getIdToMapping = (id: string): Mapping => {
  console.log('id:', id)
  console.log('mappingdict', mappingsDict)
  return mappingsDict[id]
}

const deleteDomain = (domain: string): void => {
  delete mappingsCache[domain]
  setData('mappings', Object.values(mappingsCache))
}

export {
  getData,
  setData,
  getProviderKeys,
  getMappings,
  getAvailableDomains,
  domainToMapping,
  getIdToMapping,
  deleteDomain
}
