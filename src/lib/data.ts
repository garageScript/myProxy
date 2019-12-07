import fs from 'fs'
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

  mappingsCache = data.mappings.reduce(
    (obj, item) => ({
      ...obj,
      [item.fullDomain]: item
    }),
    {}
  )

  mappingsDict = data.mappings.reduce(
    (obj, item) => ({
      ...obj,
      [item.id]: item
    }),
    {}
  )
})

// Typescript disable, because this is meant as a helper function to be used with N number of input types
const getData = (table: string): unknown => {
  return data[table]
}

// Typescript disable, because this is meant as a helper function to be used with N number of input types
const setData = (table: string, records: unknown): void => {
  data[table] = records
  if (table === 'mappings') {
    const initialData = records as Mapping[]
    mappingsCache = initialData.reduce(
      (obj, item) => ({
        ...obj,
        [item.fullDomain]: item
      }),
      {}
    )
    mappingsDict = initialData.reduce(
      (obj, item) => ({
        ...obj,
        [item.id]: item
      }),
      {}
    )
  }

  const fileData = `${JSON.stringify(data, null, 2)}`

  fs.writeFile('./data.db', fileData, err => {
    if (err) {
      return console.log('writing to DB failed', err)
    }
    console.log('successfully wrote to DB')

    // The set of code below will cause error when running
    // tests if it's pasted outside the writefile context.

    if (table === 'mappings') {
      const initialData = records as Mapping[]
      mappingsCache = initialData.reduce(
        (obj, item) => ({
          ...obj,
          [item.fullDomain]: item
        }),
        {}
      )
      mappingsDict = initialData.reduce(
        (obj, item) => ({
          ...obj,
          [item.id]: item
        }),
        {}
      )
    }
    // The line below needs to be here. For some reason,
    // data[table] value seems to be an old value and
    //   does not take the records value. Strange.
    data[table] = records
  })
}

const getProviderKeys = (): ServiceKey[] => {
  const initialData = getData('serviceKeys') as ServiceKey[] | undefined
  return initialData || []
}

const getMappings = (): MappingObj | {} => {
  return mappingsCache || {}
}

const getAvailableDomains = (): Domain[] => {
  const initialData = getData('availableDomains') as Domain[] | undefined
  return initialData || []
}

const domainToMapping = (domain: string): Mapping => {
  return mappingsCache[domain]
}

const idToMapping = (id: string): Mapping => {
  return mappingsDict[id]
}

export {
  getData,
  setData,
  getProviderKeys,
  getMappings,
  getAvailableDomains,
  domainToMapping,
  idToMapping
}
