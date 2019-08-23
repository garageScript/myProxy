import fs from 'fs'
import { DB, ServiceKey } from '../types/admin'

const data: DB = {
  serviceKeys: []
}

const getData = (serviceKeys: string) => {
  if (serviceKeys) {
    fs.readFile('./data.db', (err, file) => {
      if (err) {
        return console.log('error', err)
      }
      console.log('file read success')
      const fileData: DB = JSON.parse(file.toString() || '{}')
      data.serviceKeys = fileData.serviceKeys || []
    })
  }
}

const setData = (serviceKeys: string, data: DB) => {
  if (serviceKeys && data) {
    const fileData: string = JSON.stringify(data)
    fs.writeFile('./data.db', fileData, err => {
      if (err) {
        return console.log('error', err)
      }
      console.log('file write success')
    })
  }
}

export { getData, setData, data }
