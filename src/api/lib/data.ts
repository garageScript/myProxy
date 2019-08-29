import fs from 'fs'
import { DB, ServiceKey } from '../types/admin'

const data: DB = {
  serviceKeys: []
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
})

const getData = (table: string): any => {
  return data[table]
}

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

const getProviderKeys = () : Array<ServiceKey> => {
  return getData('serviceKeys')
}

export { getData, setData, getProviderKeys }
