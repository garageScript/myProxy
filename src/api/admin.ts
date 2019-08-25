import { DB, ServiceKey } from './types/admin'
import { setData, getData } from './lib/data'
import express from 'express'
import uuid4 from 'uuid/v4'

const app = express.Router()


app.post('/serviceHostsKey', (req, res) => {
  // create service keys
  const serviceKeys = getData('serviceKeys')
  const serviceHostKey: ServiceKey = {
    id: uuid4(),
    ...req.body
  }
  serviceKeys.push(serviceHostKey)
  setData('serviceKeys', serviceKeys)
  res.json(serviceHostKey)
})

app.get('/serviceHostsKey', (req, res) => {
  // get all servicekeys
  const serviceKeys = getData('serviceKeys')
  res.json(serviceKeys)
})

app.get('/serviceHostsKey/:id', (req, res) => {
  // grab one servicekey
  const serviceKeys = getData('serviceKeys')
  const selectedKey = serviceKeys.filter((element) => element.id === Number(req.params.id))
  res.json(selectedKey)
})

app.delete('/serviceHostsKey/:id', (req, res) => {
  // delete a servicekey
  let deletedKey;
  const serviceKeys = getData('serviceKeys')
  const updatedKeys = serviceKeys.filter((element) => {
    if(element.id !== Number(req.params.id)) return true
    if(element.id === Number(req.params.id)) deletedKey = element
    return false
  })
  setData('serviceKeys', updatedKeys)
  res.json(deletedKey)
})

app.put('/serviceHostsKey/:id', (req, res) => {
  // replace servicekey info
  let replacedKey;
  const serviceKeys = getData('serviceKeys')
  const id: number = Number(req.params.id)
  const updatedKeys = serviceKeys.map((element) => {
    if(element.id === id) {
      element = { id, ...req.body }
      replacedKey = element
    }
  })
  setData('serviceKeys', updatedKeys)
  res.json(replacedKey)
})

app.patch('/serviceHostsKey/:id', (req, res) => {
  // edit servicekey info
  let editedKey;
  const serviceKeys = getData('serviceKeys')
  const id: number = Number(req.params.id)
  const updatedKeys = serviceKeys.map((element) => {
    if(element.id === id) {
      if (req.body.key) element.key = req.body.key
      if (req.body.service) element.service = req.body.service
      if (req.body.value) element.value = req.body.value
      editedKey = element
    }
  })
  setData('serviceKeys', updatedKeys)
  res.json(editedKey)
})

module.exports = app
