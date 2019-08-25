import { DB, ServiceKey } from './types/admin'
import { setData, getData, data } from './lib/data'
import express from 'express'
import fs from 'fs'

const app = express.Router()

const serviceKeys = getData('serviceKeys')

app.post('/serviceHostsKey', (req, res) => {
  // create service keys
  const serviceHostKeys: ServiceKey = {
    id: data.serviceKeys.length,
    ...req.body
  }
  data.serviceKeys.push(serviceHostKeys)
  setData('servicekeys', data)
  res.json(serviceHostKeys)
})

app.get('/serviceHostsKey', (req, res) => {
  // get all servicekeys
  res.json(data.serviceKeys)
})

app.get('/serviceHostsKey/:id', (req, res) => {
  // grab one servicekey
  const id: number = Number(req.params.id)
  const selectedKey: ServiceKey = data.serviceKeys[id]
  res.json(selectedKey)
})

app.delete('/serviceHostsKey/:id', (req, res) => {
  // delete a servicekey
  const id: number = Number(req.params.id)
  data.serviceKeys.splice(id, 1)
  setData('servicekeys', data)
  res.json(data.serviceKeys)
})

app.put('/serviceHostsKey/:id', (req, res) => {
  // replace servicekey info
  const id: number = Number(req.params.id)
  data.serviceKeys[id] = { ...req.body }
  const replacedKey: ServiceKey = data.serviceKeys[id]
  setData('servicekeys', data)
  res.json(replacedKey)
})

app.patch('/serviceHostsKey/:id', (req, res) => {
  // edit servicekey info
  const id: number = Number(req.params.id)
  if (req.body.key) data.serviceKeys[id]['key'] = req.body.key
  if (req.body.service) data.serviceKeys[id]['service'] = req.body.service
  if (req.body.value) data.serviceKeys[id]['value'] = req.body.value
  const editedKey: ServiceKey = data.serviceKeys[id]
  setData('servicekeys', data)
  res.json(editedKey)
})

module.exports = app
