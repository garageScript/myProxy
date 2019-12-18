import express from 'express'
import uuid4 from 'uuid/v4'

import { ServiceKey } from '../types/admin'
import { Domain, ServiceResponse } from '../types/general'
import { getAvailableDomains, setData, getProviderKeys } from '../lib/data'
import { createSslCerts, setCnameRecords } from '../helpers/domainSetup'
import providers from '../providers'
import environment from '../helpers/environment'

const { isProduction } = environment
const app = express.Router()

app.post('/sslCerts', async (req, res) => {
  const { service, selectedDomain } = req.body
  const serviceResponse: ServiceResponse = {
    success: true,
    message: 'SSL Certs and domain name records successfully created'
  }

  try {
    if (isProduction()) {
      const sslCertResponse = await createSslCerts(
        serviceResponse,
        service,
        selectedDomain
      )
      if (!sslCertResponse.success) return res.json(sslCertResponse)

      const cnameResponse = await setCnameRecords(
        service,
        selectedDomain,
        serviceResponse
      )
      if (!cnameResponse.success) return res.json(cnameResponse)
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

app.patch('/sslCerts/:selectedDomain', async (req, res) => {
  const service = req.body.service
  const selectedDomain = req.params.selectedDomain
  const serviceResponse: ServiceResponse = {
    success: true,
    message:
      'SSL Certs and domain name records have successfully been reconfigured'
  }
  try {
    if (isProduction()) {
      const sslCertResponse = await createSslCerts(
        serviceResponse,
        service,
        selectedDomain
      )
      if (!sslCertResponse.success) return res.json(sslCertResponse)

      const cnameResponse = await setCnameRecords(
        service,
        selectedDomain,
        serviceResponse
      )
      if (!cnameResponse.success) return res.json(cnameResponse)
    }
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
  const data = await Promise.all([
    providers.dns_gd.getDomains(),
    providers.nameDotCom.getDomains()
  ])
  const filteredData = data.map(domainElement => {
    if (domainElement.domains.code) domainElement.domains = []
    return domainElement
  })
  return res.json(filteredData) // Data send to view providers ?
})

export default { app }
