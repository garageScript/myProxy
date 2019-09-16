import { ServiceKey } from './types/admin'
import { Domain, ProviderService, ServiceResponse } from './types/general'
import { getAvailableDomains, setData, getProviderKeys } from './lib/data'
import express from 'express'
import uuid4 from 'uuid/v4'
import util from 'util'
import cp from 'child_process'
import serviceConfig from './serviceConfig'
import providers from '../providers'

const app = express.Router()
const exec = util.promisify(cp.exec)

app.post('/sslCerts', async (req, res) => {
  const { service, selectedDomain } = req.body

  const serviceResponse: ServiceResponse = {
    success: true,
    message: 'SSL Certs and domain name records successfully created'
  }
  try {
    const serviceKeys = getProviderKeys().filter(d => d.service === service)
    const { keys } = serviceConfig[service]
    const envVars = keys.reduce((acc: string, key: string) => {
      const { value } = serviceKeys.find(d => d.key === key) || { value: '' }
      return acc + `${key}=${value} `
    }, '')
    const acme = `./acme.sh/acme.sh --issue --dns ${service}`
    const cert1 = `${acme} -d ${selectedDomain} --force`
    const cert2 = `${acme} -d *.${selectedDomain} --force`
    const { stderr } = await exec(`${envVars} & ${cert1} & ${cert2}`)
    if (stderr) {
      serviceResponse.success = false
      serviceResponse.message = `Could not create SSL Certs. Error: ${JSON.stringify(
        stderr
      )}`
      return res.json(serviceResponse)
    }

    const { stdout: ipaddress } = await exec('curl ifconfig.me')
    const providerService = providers[service] as ProviderService
    if (!providerService) {
      serviceResponse.success = false
      serviceResponse.message = 'Provider not found'
      return res.json(serviceResponse)
    }
    const setRecords: ServiceResponse = await providerService.setRecord(
      selectedDomain,
      ipaddress
    )
    if (!setRecords.success) {
      return res.json(setRecords)
    }

    const domains = getAvailableDomains()
    const domain: Domain = {
      domain: selectedDomain,
      expiration: '<ssl expiration date will go here>',
      provider: service
    }
    domains.push(domain)
    setData('availableDomains', domains)
    return res.json(serviceResponse)
  } catch (err) {
    serviceResponse.success = false
    serviceResponse.message = `Error: ${JSON.stringify(err)}`
    return res.json(serviceResponse)
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

app.get('/providers', async (_, res) => {
  const data = await Promise.all([providers.dns_gd.getDomains()])
  const filteredData = data.map(domainElement => {
    if (domainElement.domains.code) domainElement.domains = []
    return domainElement
  })
  return res.json(filteredData) // Data send to view providers ?
})

export default { app }
