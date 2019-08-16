const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const { promisify } =  require('util')
const exec = promisify(require('child_process').exec)

const app = express()
app.use(bodyParser.json());
const port = 3000

import path from 'path'
const app = express()
const port = process.env.PORT || 3000
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../../src/views'))

app.get('/', (req, res) => res.render('index', { message: 'Hello World' }))

app.get('/admin/serviceHostKeys', (req, res) => {
  res.render('admin')
})

let store = []
const createCert = async (key: String, service: String, value: String)=>{
  try{
    const terminalCommand = await exec('cat app.ts')
    const certStore = JSON.stringify({cert: terminalCommand})
    store.push(certStore)
    fs.appendFile('cert.txt', store, (error)=>console.log('error', error))
  }catch(error){
    console.log('error', error) 
  }
}

app.post('/api/admin/serviceHostsKeys', (req, res)=>{
  // create proxy
    createCert('10','dns', 'hello')
    res.json({success: 'proxy created'})
})

app.get('/api/admin/serviceHostsKeys', (req, res)=>{
  // get all proxies
  res.json({proxies: 'all proxies'})
})

app.get('/api/admin/serviceHostsKeys/:id', (req, res)=>{
  // get one proxy
  res.json({proxy: 'one proxy'})
})

app.delete('/api/admin/serviceHostsKeys/:id', (req, res)=>{
  // delete proxy
  res.json({success: 'proxy deleted'})
})

app.put('/api/admin/serviceHostsKeys/:id', (req, res)=>{
  // replace proxy info
  res.json({succes: 'proxy info replaced'})
})

app.patch('/api/admin/serviceHostsKeys/:id', (req, res)=>{
  // edit proxy info
  res.json({success: 'proxy info edited'})
})

app.listen(port, () => console.log(`app listening on port ${port}!`))
