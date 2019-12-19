import { ServiceConfig } from '../types/general'

export default {
  dns_gd: require('./goDaddy'),
  dns_namecom: require('./nameDotCom')
} as ServiceConfig
