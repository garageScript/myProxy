import { Mapping, MappingObj } from '../types/general'

const createIdCache = (records: Mapping[]): MappingObj | {} => {
  return records.reduce(
    (obj, item) => ({
      ...obj,
      [item.id]: item
    }),
    {}
  )
}

const createDomainCache = (records: Mapping[]): MappingObj | {} => {
  return records.reduce(
    (obj, item) => ({
      ...obj,
      [item.fullDomain]: item
    }),
    {}
  )
}

export { createDomainCache, createIdCache }
