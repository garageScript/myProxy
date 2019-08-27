import fs from 'fs'
import { DB } from '../types/admin'

const data: DB = {
  serviceKeys: []
}

fs.readFile('./data.db', (err, file) => {
  if (err) {
    return console.log('error reading db file', err)
  }
  console.log('loading db file successful')
  const fileData: DB = JSON.parse(file.toString() || '{}')
  data.serviceKeys = fileData.serviceKeys || []
})

const getData = (table: string) => {
  return data[table]
}

const setData = (table: string, records: any) => {
  data[table] = records
  const fileData: string = JSON.stringify(data)
  fs.writeFile('./data.db', fileData, err => {
    if (err) {
      return console.log('writing to DB failed', err)
    }
    console.log('successfully wrote to DB')
  })
}

export { getData, setData }
