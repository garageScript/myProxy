import express from 'express'
import fs from 'fs'

type ServiceKey = {
  id?: string,
  key?: string, 
  value?: string,
  service?: string
}

type DB = {
  serviceKeys: Array<ServiceKey>
}

const app = express.Router()
const data: DB = {
  serviceKeys: []
}

const writeFile = ()=>{
  const fileData: string = JSON.stringify(data)
  fs.writeFile('./data.db', fileData,  (err)=>{
    if(err) {
      return console.log('error', err)
    }
    console.log('file write success')
  })
}

fs.readFile('./data.db', (err, file)=>{
  if(err){
    return console.log('error', err)
  }
  console.log('file read success')
  const fileData = JSON.parse(file.toString() || '{}')
  data.serviceKeys = fileData.serviceKeys || []
})

app.post('/serviceHostsKeys', (req, res)=>{
  // create service keys
  const serviceHostKeys: object = {id: data.serviceKeys.length, ...req.body}
  data.serviceKeys.push(serviceHostKeys)
  writeFile()
  res.json(serviceHostKeys)
})

app.get('/serviceHostsKeys', (req, res)=>{
  // get all servicekeys
  res.send('hello world')
  //``res.json(data.serviceKeys)
})

app.get('/serviceHostsKeys/:id', (req, res)=>{
  // grab one servicekey
  const id = req.params.id
  const selectedKey = data.serviceKeys.find((key)=>{
    if(key.id === id){
      return key
    }
  })
  res.json(selectedKey)
})

app.delete('/serviceHostsKeys/:id', (req, res)=>{
  // delete a servicekey
  const id = req.params.id
  data.serviceKeys.forEach((key, i)=>{
    if(key.id === id){
      data.serviceKeys.splice(i, 1) 
    }
  })
  writeFile()
  res.json(data.serviceKeys)
})

app.put('/serviceHostsKeys/:id', (req, res)=>{
  // replace servicekey info
  const id = req.params.id
  let replacedKey;
  data.serviceKeys.forEach((key, i)=>{
    if(key.id === id){
      data.serviceKeys[i]['key']=req.body.key
      data.serviceKeys[i]['value']=req.body.value
      data.serviceKeys[i]['service']=req.body.service 
      replacedKey = data.serviceKeys[i]
    }
  })
  writeFile()
  res.json(replacedKey)
})

app.patch('/serviceHostsKeys/:id', (req, res)=>{
  // edit servicekey info
  const id = req.params.id
  let editedKey;
  data.serviceKeys.forEach((key,i)=>{
    if(key.id===id){
      if(req.body.key){
        data.serviceKeys[i]['key']=req.body.key
      }
      if(req.body.service){
        data.serviceKeys[i]['service']=req.body.service
      }
      if(req.body.value){
        data.serviceKeys[i]['value']=req.body.value
      }
      editedKey = data.serviceKeys[i]
    }
  })
  writeFile()
  res.json(editedKey)
})

module.exports = app
