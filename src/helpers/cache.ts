import { Mapping, MappingById } from '../types/general'

const mapById = <T extends { id: string }>(
  records: T[]
): { [id: string]: T } => {
  return records.reduce((obj, item) => ({ ...obj, [item.id]: item }), {})
}

const mapByDomain = (records: Mapping[]): MappingById => {
  return records.reduce(
    (obj, item) => ({ ...obj, [item.fullDomain]: item }),
    {}
  )
}

export { mapById, mapByDomain }
