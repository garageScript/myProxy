const app = express.Router()
const data = {}
const writeFile = ()=>{
  const fileData = JSON.stringify(data)
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
  const fileData = JSON.parse(file || '{}')
  data.serviceKeys = fileData.serviceKeys || []
})

app.post('/api/admin/serviceHostsKeys', (req, res)=>{
  // create service keys
  const serviceHostKeys = {id: data.serviceKeys.length, ...req.body}
  data.serviceKeys.push(serviceHostKeys)
  writeFile()
  res.json(serviceHostKeys)
})

app.get('/api/admin/serviceHostsKeys', (req, res)=>{
  // get all servicekeys
  res.json(data)
})

app.get('/api/admin/serviceHostsKeys/:id', (req, res)=>{
  // grab one servicekey
  const id = req.params.id
  let key;
  data.serviceKeys.forEach((keys)=>{
    if(keys[id]){
      key = keys;
    }
  })
  res.json(key)
})

app.delete('/api/admin/serviceHostsKeys/:id', (req, res)=>{
  // delete a servicekey
  const id = req.params.id
  data.serviceKeys.forEach((keys, i)=>{
    if(keys[id]){
      data.serviceKeys.splice(i, 1) 
    }
  })
  writeFile()
  res.json(data)
})

app.put('/api/admin/serviceHostsKeys/:id', (req, res)=>{
  // replace servicekey info
  const id = req.params.id
  let replacedKey;
  data.serviceKeys.forEach((keys, i)=>{
    if(keys[id]){
      data.serviceKeys[i]['key']=req.body.key
      data.serviceKeys[i]['value']=req.body.value
      data.serviceKeys[i]['service']=req.body.service 
      replacedKey = data.serviceKeys[i]
    }
  })
  writeFile()
  res.json(replacedKey)
})

app.patch('/api/admin/serviceHostsKeys/:id', (req, res)=>{
  // edit servicekey info
  const id = req.params.id
  let editedKey;
  data.serviceKeys.forEach((keys,i)=>{
    if(keys[id]){
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
