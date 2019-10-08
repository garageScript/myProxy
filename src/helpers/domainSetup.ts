import serviceConfig from '../api/serviceConfig'
import { getProviderKeys } from '../lib/data'
import { ServiceResponse, ProviderService } from '../types/general'
import providers from '../providers'
import cp from 'child_process'
import util from 'util'
const exec = util.promisify(cp.exec)

const createSslCerts = async (
  serviceResponse,
  service,
  selectedDomain
): Promise<ServiceResponse> => {
  const serviceKeys = getProviderKeys().filter(d => d.service === service)
  const { keys } = serviceConfig[service]
  const envVars = keys.reduce((acc: string, key: string) => {
    const { value } = serviceKeys.find(d => d.key === key) || { value: '' }
    return acc + `${key}=${value} `
  }, '')
  const acme = `./acme.sh/acme.sh --issue --dns ${service}`
  const cert1 = `${acme} -d ${selectedDomain} --force`
  const cert2 = `${acme} -d *.${selectedDomain} --force`
  const cert1Response = await exec(`${envVars} ${cert1}`)
  const cert2Response = await exec(`${envVars} ${cert2}`)
  if (cert1Response.stderr || cert2Response.stderr) {
    serviceResponse.success = false
    serviceResponse.message = `Could not create SSL Certs. Error: ${
      cert2Response.stderr
        ? JSON.stringify(cert2Response.stderr)
        : JSON.stringify(cert1Response.stderr)
    }`
  }
  return serviceResponse
}

const setCnameRecords = async (
  service,
  selectedDomain,
  serviceResponse
): Promise<ServiceResponse> => {
  const { stdout: ipaddress } = await exec('curl ifconfig.me')
  const providerService = providers[service] as ProviderService
  if (!providerService) {
    serviceResponse.success = false
    serviceResponse.message = 'Provider not found'
    return serviceResponse
  }
  const setRecords: ServiceResponse = await providerService.setRecord(
    selectedDomain,
    ipaddress
  )
  return setRecords
}

export { createSslCerts, setCnameRecords }
