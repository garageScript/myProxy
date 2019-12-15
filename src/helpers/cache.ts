import { Mapping, MappingById, AccessToken, TokenById } from '../types/general'

const createIdCache = (records: Mapping[]): MappingById => {
  return records.reduce((obj, item) => ({ ...obj, [item.id]: item }), {})
}

const createDomainCache = (records: Mapping[]): MappingById => {
  return records.reduce(
    (obj, item) => ({ ...obj, [item.fullDomain]: item }),
    {}
  )
}

const createTokenCache = (records: AccessToken[]): TokenById => {
  return records.reduce((obj, item) => ({ ...obj, [item.id]: item }), {})
}

export { createDomainCache, createIdCache, createTokenCache }
