import { ServiceKey } from './types/admin'
import { setData, getProviderKeys } from './lib/data'
import express from 'express'
import uuid4 from 'uuid/v4'
import util from 'util'
import cp from 'child_process'
import serviceConfig from './serviceConfig'

const app = express.Router()
const exec = util.promisify(cp.exec)

app.post('/sslCerts', async (req, res) => {
  try {
    const serviceKeys = getProviderKeys().filter(
      d => d.service === req.body.service
    )
    const envVars = serviceConfig[req.body.service].keys.reduce(
      (acc: string, key: string) => {
        return acc + `${key}=${serviceKeys.find(d => d.key === key)} `
      },
      ''
    )
    const { stdout, stderr } = await exec(
      `${envVars} ./scripts/acme.sh/acme.sh --issue --dns ${req.body.service} -d ${req.body.selectedDomain} -d www.${req.body.selectedDomain}`
    )
    if (stderr) {
      console.log('stderr', stderr)
    }
    console.log('stdout', stdout)
    res.json('cert successfully created')
  } catch (err) {
    console.log('failed to create cert', err)
    res.json({ 'failed to create cert': err })
  }
})

app.post('/providerKeys', (req, res) => {
  // create service keys
  const serviceKeys = getProviderKeys()
  const providerKey: ServiceKey = {
    id: uuid4(),
    ...req.body
  }
  serviceKeys.push(providerKey)
  setData('serviceKeys', serviceKeys)
  res.json(providerKey)
})

app.get('/providerKeys', (req, res) => {
  // get all servicekeys
  const serviceKeys = getProviderKeys()
  res.json(serviceKeys)
})

app.get('/providerKeys/:id', (req, res) => {
  // grab one servicekey
  const serviceKeys = getProviderKeys()
  const selectedKey = serviceKeys.find(
    (element: ServiceKey) => element.id === req.params.id
  )
  res.json(selectedKey)
})

app.delete('/providerKeys/:id', (req, res) => {
  // delete a servicekey
  const serviceKeys = getProviderKeys()
  const updatedKeys = serviceKeys.filter(
    (element: ServiceKey) => element.id !== req.params.id
  )
  setData('serviceKeys', updatedKeys)
  const updatedKey = serviceKeys.find(
    (element: ServiceKey) => element.id === req.params.id
  )
  res.json(updatedKey)
})

app.put('/providerKeys/:id', (req, res) => {
  // replace servicekey info
  const serviceKeys = getProviderKeys()
  const id: string = req.params.id
  const updatedKeys = serviceKeys.map((element: ServiceKey) => {
    if (element.id === id) element = { id, ...req.body }
    return element
  })
  setData('serviceKeys', updatedKeys)
  const updatedKey = serviceKeys.find(
    (element: ServiceKey) => element.id === id
  )
  res.json(updatedKey)
})

app.patch('/providerKeys/:id', (req, res) => {
  // edit servicekey info
  const serviceKeys = getProviderKeys()
  const id: string = req.params.id
  const updatedKeys = serviceKeys.map((element: ServiceKey) => {
    if (element.id === id) {
      if (req.body.key) element.key = req.body.key
      if (req.body.service) element.service = req.body.service
      if (req.body.value) element.value = req.body.value
    }
    return element
  })
  setData('serviceKeys', updatedKeys)
  const updatedKey = serviceKeys.find(
    (element: ServiceKey) => element.id === id
  )
  res.json(updatedKey)
})

export default { app }
