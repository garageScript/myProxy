import fs from 'fs'
import { DB, ServiceKey } from '../types/admin'
import { Mapping, Domain } from '../types/general'

const data: DB = {
  serviceKeys: [],
  mappings: [],
  availableDomains: []
}

fs.readFile('./data.db', (err, file) => {
  if (err) {
    return console.log(
      'File does not exist, but do not worry. File will be created on first save',
      err
    )
  }
  console.log('loading db file successful')
  const fileData: DB = JSON.parse(file.toString() || '{}')
  data.serviceKeys = fileData.serviceKeys || []
  data.mappings = fileData.mappings || []
  data.availableDomains = fileData.availableDomains || []
})

// Typescript disable, because this is meant as a helper function to be used with N number of input types
// eslint-disable-next-line
const getData = (table: string): any => {
  return data[table]
}

// Typescript disable, because this is meant as a helper function to be used with N number of input types
// eslint-disable-next-line
const setData = (table: string, records: any): void => {
  data[table] = records
  const fileData: string = JSON.stringify(data)
  fs.writeFile('./data.db', fileData, err => {
    if (err) {
      return console.log('writing to DB failed', err)
    }
    console.log('successfully wrote to DB')
  })
}

const getProviderKeys = (): Array<ServiceKey> => {
  return getData('serviceKeys') || []
}

const getMappings = (): Array<Mapping> => {
  return getData('mappings')
}

const getAvailableDomains = (): Array<Domain> => {
  return getData('availableDomains')
}

export { getData, setData, getProviderKeys, getMappings, getAvailableDomains }
