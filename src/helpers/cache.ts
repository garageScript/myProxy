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

const mapById = <T extends { id: string }>(
  records: T[]
): { [id: string]: T } => {
  return records.reduce((obj, item) => ({ ...obj, [item.id]: item }), {})
}

export { createDomainCache, createIdCache, mapById }
