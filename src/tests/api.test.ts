import { startAppServer } from '../server/server'
import fetch from 'node-fetch'

const TEST_PORT = 4242
const ADMIN = process.env.ADMIN || '4995'
const apiUrl = `http://127.0.0.1:${TEST_PORT}`

describe('/api', () => {
  let server

  beforeAll(async () => {
    server = await startAppServer(TEST_PORT, ADMIN)
  })

  afterAll(() => {
    server.close()
  })

  it('Should respond with 401 if pw does not match', async () => {
    const response = await fetch(`${apiUrl}/api/admin/providerKeys`, {
      headers: {
        authorization: 'oaeuou aoueHello'
      }
    })
    expect(response.status).toEqual(401)
  })

  describe('/api/admin', () => {
    it('Should respond with 200 if pw matches', async () => {
      const response = await fetch(`${apiUrl}/api/admin/providerKeys`, {
        headers: {
          authorization: ADMIN
        }
      })
      expect(response.status).toEqual(200)
    })
  })
})
