import { ServiceConfig } from '../types/general'

export default {
  dns_gd: require('./goDaddy'),
  nameDotCom: require('./nameDotCom')
} as ServiceConfig
