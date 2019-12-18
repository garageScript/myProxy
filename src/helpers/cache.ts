import { Mapping, MappingById } from '../types/general'

const createIdCache = (records: Mapping[]): MappingById => {
  return records.reduce(
    (obj, item) => ({
      ...obj,
      [item.id]: item
    }),
    {}
  )
}

const createDomainCache = (records: Mapping[]): MappingById => {
  return records.reduce(
    (obj, item) => ({
      ...obj,
      [item.fullDomain]: item
    }),
    {}
  )
}

export { createDomainCache, createIdCache }
