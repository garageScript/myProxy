import { ProviderInfo } from '../types/general'

/**
 * Currently acme.sh supports most of the dns providers
 * https://github.com/Neilpang/acme.sh/wiki/dnsapi
 * Updated on December 20 2019
 */

export const GoDaddy = {
  NAME: 'GoDaddy',
  DNS_API: 'dns_gd',
  PRIMARY_KEY: 'GD_Key',
  SECONDARY_KEY: 'GD_Secret',
  SERVICE: 'https://api.godaddy.com'
} as ProviderInfo
