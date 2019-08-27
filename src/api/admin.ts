import { DB, ServiceKey } from './types/admin'
import { setData, getData } from './lib/data'
import express from 'express'
import uuid4 from 'uuid/v4'

const app = express.Router()

app.post('/serviceHostKeys', (req, res) => {
  // create service keys
  const serviceKeys = getData('serviceKeys') || []
  const serviceHostKey: ServiceKey = {
    id: uuid4(),
    ...req.body
  }
  serviceKeys.push(serviceHostKey)
  setData('serviceKeys', serviceKeys)
  res.json(serviceHostKey)
})

app.get('/serviceHostKeys', (req, res) => {
  // get all servicekeys
  const serviceKeys = getData('serviceKeys')
  res.json(serviceKeys)
})

app.get('/serviceHostKeys/:id', (req, res) => {
  // grab one servicekey
  const serviceKeys = getData('serviceKeys')
  const selectedKey = serviceKeys.find(element => element.id === req.params.id)
  res.json(selectedKey)
})

app.delete('/serviceHostKeys/:id', (req, res) => {
  // delete a servicekey
  const serviceKeys = getData('serviceKeys')
  const updatedKeys = serviceKeys.filter(element => element.id !== req.params.id)
  setData('serviceKeys', updatedKeys)
  const updatedKey = serviceKeys.find(element => element.id === req.params.id)
  res.json(updatedKey)
})

app.put('/serviceHostKeys/:id', (req, res) => {
  // replace servicekey info
  const serviceKeys = getData('serviceKeys')
  const id: string = req.params.id
  const updatedKeys = serviceKeys.map(element => {
    if (element.id === id) element = { id, ...req.body }
    return element
  })
  setData('serviceKeys', updatedKeys)
  const updatedKey = serviceKeys.find(element => element.id === id)
  res.json(updatedKey)
})

app.patch('/serviceHostKeys/:id', (req, res) => {
  // edit servicekey info
  const serviceKeys = getData('serviceKeys')
  const id: string = req.params.id
  const updatedKeys = serviceKeys.map(element => {
    if (element.id === id) {
      if (req.body.key) element.key = req.body.key
      if (req.body.service) element.service = req.body.service
      if (req.body.value) element.value = req.body.value
    }
    return element
  })
  setData('serviceKeys', updatedKeys)
  const updatedKey = serviceKeys.find(element => element.id === id)
  res.json(updatedKey)
})

export default { app }
