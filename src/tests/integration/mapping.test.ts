import { startAppServer } from '../../server/server'
import uuidv4 from 'uuid/v4'
import { mappingAdapter } from '../helpers/mappingAdapter'
import { getMappingByDomain } from '../../lib/data'

const TEST_PORT = process.env.PORT || 50604
const ADMIN = process.env.ADMIN || 'hjhj'

describe('/api', () => {
  let server

  beforeAll(async () => {
    server = await startAppServer(TEST_PORT, ADMIN)
  })

  afterAll(() => {
    server.close()
  })

  it('checks mappings for newly added mapping and it converts domain and subdomain to lowercase', async () => {
    const subDomain = `Testing${uuidv4()}`
    const domain = 'Rahul'
    const port = '5678'
    const postResponse = await mappingAdapter('/', 'POST', {
      domain,
      subDomain,
      port
    })
    const postMapping = await postResponse.json()
    expect(postMapping.port).toEqual(port)
    expect(postMapping.subDomain).toEqual(subDomain.toLowerCase())
    expect(postMapping.domain).toEqual(domain.toLowerCase())
    expect(postMapping.fullDomain).toEqual(
      `${subDomain}.${domain}`.toLowerCase()
    )
    const deleteResponse = await mappingAdapter(`/${postMapping.id}`, 'DELETE')
    expect(deleteResponse.status).toEqual(200)
    const getMapping = await mappingAdapter(`/${postMapping.id}`, 'GET')
    expect(getMapping.status).toEqual(200)
    const mappingData = await getMapping.json()
    expect(Object.keys(mappingData).length).toEqual(0)
  })

  it('checks mappings for newly added root domain', async () => {
    const subDomain = ''
    const domain = `rahul${Date.now()}`
    const port = '5612'
    const postResponse = await mappingAdapter('/', 'POST', {
      subDomain,
      domain,
      port
    })
    const postMapping = await postResponse.json()
    expect(postMapping.port).toEqual(port)
    expect(postMapping.domain).toEqual(domain)
    expect(postMapping.subDomain).toEqual(subDomain)
    expect(postMapping.fullDomain).toEqual(`${domain}`)

    const mappingResponse = await mappingAdapter(`/${postMapping.id}`, 'GET')
    const mappingData = await mappingResponse.json()

    expect(mappingData.port).toEqual(port)
    expect(mappingData.domain).toEqual(domain)
    expect(mappingData.subDomain).toEqual(subDomain)
    expect(mappingData.fullDomain).toEqual(`${domain}`)

    const deleteResponse = await mappingAdapter(`/${postMapping.id}`, 'DELETE')
    expect(deleteResponse.status).toEqual(200)
  })

  it('Delete mapping', async () => {
    const subDomain = `delete${uuidv4()}`
    const domain = 'albertow'
    const port = '4500'
    const createMapping = await mappingAdapter('/', 'POST', {
      domain,
      subDomain,
      port
    })
    expect(createMapping.status).toEqual(200)
    const mapping = await createMapping.json()
    const delMapping = await mappingAdapter(`/${mapping.id}`, 'DELETE')
    expect(delMapping.status).toEqual(200)
    const deletedMapping = await delMapping.json()
    expect(deletedMapping.port).toEqual(port)
    expect(deletedMapping.subDomain).toEqual(subDomain)
    expect(deletedMapping.domain).toEqual(domain)
    expect(deletedMapping.fullDomain).toEqual(`${subDomain}.${domain}`)
    expect(deletedMapping.id).toEqual(mapping.id)
    const getMapping = await mappingAdapter(`/${mapping.id}`, 'GET')
    expect(getMapping.status).toEqual(200)
    const mappingData = await getMapping.json()
    expect(Object.keys(mappingData).length).toEqual(0)
  })

  it('checks no duplicate subdomain is created for same domain', async () => {
    const subDomain = `testing${uuidv4()}`
    const domain = 'Sahil'
    const port = '3522'
    const postResponse = await mappingAdapter('/', 'POST', {
      domain,
      subDomain,
      port
    })
    expect(postResponse.status).toEqual(200)
    const duplicatePostResponse = await mappingAdapter('/', 'POST', {
      domain,
      subDomain,
      port
    })
    expect(duplicatePostResponse.status).toEqual(400)
    const postMapping = await postResponse.json()
    const deleteResponse = await mappingAdapter(`/${postMapping.id}`, 'DELETE')
    expect(deleteResponse.status).toEqual(200)

    const getMapping = await mappingAdapter(`/${postMapping.id}`, 'GET')
    expect(getMapping.status).toEqual(200)
    const mappingData = await getMapping.json()
    expect(Object.keys(mappingData).length).toEqual(0)
  })

  it('checks same subdomain can be used for different domains', async () => {
    const subDomain = `testing${uuidv4()}`
    const domain = 'VinDiesel'
    const port = '3522'
    await mappingAdapter('/', 'POST', {
      domain,
      subDomain,
      port
    })

    const secondDomain = 'PaulWalker'
    const nextPort = '3523'
    await mappingAdapter('/', 'POST', {
      domain: secondDomain,
      port: nextPort,
      subDomain
    })

    const firstFullDomain = `${subDomain}.${domain}`.toLowerCase()
    const secondFullDomain = `${subDomain}.${secondDomain}`.toLowerCase()
    const match1 = getMappingByDomain(firstFullDomain)
    const match2 = getMappingByDomain(secondFullDomain)

    expect(match1.fullDomain).toEqual(firstFullDomain)
    expect(match2.fullDomain).toEqual(secondFullDomain)
    await mappingAdapter(`/${match1.id}`, 'DELETE')
    await mappingAdapter(`/${match2.id}`, 'DELETE')
  })

  it('checks status is returned when querying mappings', async () => {
    const subDomain = uuidv4()
    const domain = 'VinDiesel'
    const port = '3533'
    await mappingAdapter('/', 'POST', {
      domain,
      subDomain,
      port
    })

    const getResponse = await mappingAdapter('/', 'GET')
    const getMappings = await getResponse.json()

    expect(getMappings[0].status).toEqual('not started')
    await mappingAdapter(`/${getMappings[0].id}`, 'DELETE')
  })
})
