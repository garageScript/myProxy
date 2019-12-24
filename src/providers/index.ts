import { ServiceConfig, ProviderInfo } from '../types/general'

/**
 * Currently acme.sh supports most of the dns providers
 * https://github.com/Neilpang/acme.sh/wiki/dnsapi
 * Updated on December 20 2019
 *
 * To add a new provider please
 * follow acme.sh naming convention
 * {
 *  name -> Provider name
 *  dns -> dns_provider
 *  key -> [PROVIDER_Key, ...etc]
 *  service: Provider API
 *  path: relative path of the provider file in "./src"
 * }
 */
export const providerList = [
  {
    name: 'GoDaddy',
    dns: 'dns_gd',
    keys: ['GD_Key', 'GD_Secret'],
    service: 'https://api.godaddy.com',
    path: './goDaddy'
  }
] as ProviderInfo[]

/**
 * This code below add each provider file
 * to the default export
 * eg: providers = {
 *  dns_gd: require(./goDaddy)
 *  ...other providers
 * }
 */
const providers = {} as ServiceConfig
providerList.forEach(
  provider => (providers[provider.dns] = require(provider.path))
)

export default providers
