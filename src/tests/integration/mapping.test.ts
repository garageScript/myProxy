import { startAppServer } from '../../server/server'
import fetch from 'node-fetch'
import uuidv4 from 'uuid/v4'

const TEST_PORT = process.env.PORT || 50604
const ADMIN = process.env.ADMIN || 'hjhj'
const apiURL = `http://127.0.0.1:${TEST_PORT}`

describe('/api', () => {
  let server

  beforeAll(async () => {
    server = await startAppServer(TEST_PORT, ADMIN)
  })

  afterAll(() => {
    server.close()
  })

  it('checks mappings for newly added mapping', async () => {
    const subDomain = `testing${uuidv4()}`
    const domain = 'Rahul'
    const port = '5678'
    await fetch(`${apiURL}/api/mappings`, {
      method: 'POST',
      headers: {
        authorization: ADMIN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        domain,
        subDomain,
        port
      })
    })
      .then(r => r.json())
      .then(data => {
        expect(data.port).toEqual(port)
        expect(data.subDomain).toEqual(subDomain)
        expect(data.domain).toEqual(domain)
        expect(data.fullDomain).toEqual(`${subDomain}.${domain}`)
      })
  })

  it('checks no duplicate subdomain is created for same domain', async () => {
    const subDomain = `testing${uuidv4()}`
    const domain = 'Sahil'
    const port = '3522'
    await fetch(`${apiURL}/api/mappings`, {
      method: 'POST',
      headers: {
        authorization: ADMIN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        domain,
        subDomain,
        port
      })
    })
    const response = await fetch(`${apiURL}/api/mappings`, {
      method: 'POST',
      headers: {
        authorization: ADMIN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        domain,
        subDomain,
        port
      })
    })
    expect(response.status).toEqual(400)
  })

  it('checks if changes to the resource has been saved', async () => {
    const subDomain = `testing${uuidv4()}`
    const domain = 'integration'
    const port = '3457'

    const maps = await fetch(`${apiURL}/api/mappings`, {
      method: 'POST',
      headers: {
        authentication: ADMIN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        domain,
        subDomain,
        port
      })
    }).then(r => r.json())
    const id = maps.id

    const response = await fetch(`${apiURL}/api/mappings/${id}`, {
      method: 'PATCH',
      headers: {
        authentication: ADMIN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subDomain: 'testingPatch',
        domain,
        port: '4563'
      })
    })
    const data = await fetch(`${apiURL}/api/mappings`).then(r => r.json())
    return expect(data.id).toEqual(id)
  })
})
