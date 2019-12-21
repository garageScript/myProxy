import { GoDaddy } from '../constants/providers'

const serviceConfig: unknown = {
  [GoDaddy.DNS_API]: {
    name: 'Godaddy',
    keys: [GoDaddy.PRIMARY_KEY, GoDaddy.SECONDARY_KEY]
  }
}

export default serviceConfig
