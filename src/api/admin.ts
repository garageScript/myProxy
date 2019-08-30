import { ServiceKey } from './types/admin'
import { setData, getData } from './lib/data'
import express from 'express'
import uuid4 from 'uuid/v4'
import util from 'util'
import cp from 'child_process'
import serviceConfig from './serviceConfig'

const app = express.Router()
const exec = util.promisify(cp.exec)

app.post('/sslCerts', async (req, res) => {
  try {
    const serviceKeys = (getData('serviceKeys') || []).filter(
      (d: any) => d.service === req.body.service
    )
    const envVars = serviceConfig[req.body.service].keys.reduce(
      (acc: string, key: string) => {
        return acc + `${key}=${serviceKeys.find((d: any) => d.key === key)} `
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
  const selectedKey = serviceKeys.find(
    (element: ServiceKey) => element.id === req.params.id
  )
  res.json(selectedKey)
})

app.delete('/serviceHostKeys/:id', (req, res) => {
  // delete a servicekey
  const serviceKeys = getData('serviceKeys')
  const updatedKeys = serviceKeys.filter(
    (element: ServiceKey) => element.id !== req.params.id
  )
  setData('serviceKeys', updatedKeys)
  const updatedKey = serviceKeys.find(
    (element: ServiceKey) => element.id === req.params.id
  )
  res.json(updatedKey)
})

app.put('/serviceHostKeys/:id', (req, res) => {
  // replace servicekey info
  const serviceKeys = getData('serviceKeys')
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

app.patch('/serviceHostKeys/:id', (req, res) => {
  // edit servicekey info
  const serviceKeys = getData('serviceKeys')
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
