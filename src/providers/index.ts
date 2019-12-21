import { ServiceConfig } from '../types/general'
import { GoDaddy } from '../constants/providers'

export default {
  [GoDaddy.DNS_API]: require('./goDaddy')
} as ServiceConfig
