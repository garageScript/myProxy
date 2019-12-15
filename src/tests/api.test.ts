import { startAppServer } from '../server/server'
import fetch from 'node-fetch'

const TEST_PORT = process.env.PORT || 4998
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

  describe('/api/admin', () => {
    it('Should respond with 200 if pw matches', async () => {
      const response = await fetch(`${apiUrl}/api/admin/providerKeys`, {
        headers: {
          authorization: ADMIN
        }
      })
      expect(response.status).toEqual(200)
    })

    it('Should respond with 401 if pw does not match', async () => {
      const response = await fetch(`${apiUrl}/api/admin/providerKeys`, {
        headers: {
          authorization: 'oaeuou aoueHello'
        }
      })
      expect(response.status).toEqual(401)
    })
  })

  describe('api/availableDomains', () => {
    it('Should respond with 200 and return an array', async () => {
      const response = await fetch(`${apiUrl}/api/availableDomains`, {
        headers: {
          authorization: ADMIN
        }
      })
      expect(response.status).toEqual(200)
      const data = await response.json()
      expect(data).toBeInstanceOf(Array)
    })
  })

  describe('/api/mappings', () => {
    it('Should respond with 200 if Access Token is valid', async () => {
      const tokenResponse = await fetch(`${apiUrl}/api/accessTokens/`, {
        method: 'POST',
        body: JSON.stringify({ name: 'BNR34' }),
        headers: {
          authorization: ADMIN,
          'Content-Type': 'application/json'
        }
      })
      const { id } = await tokenResponse.json()
      const mappingResponse = await fetch(`${apiUrl}/api/mappings`, {
        headers: {
          access: id
        }
      })
      expect(mappingResponse.status).toEqual(200)
      await fetch(`${apiUrl}/api/accessTokens/${id}`, {
        method: 'DELETE',
        headers: {
          authorization: ADMIN
        }
      })
    })
    it('Should respond with 401 if Access Token is invalid', async () => {
      const tokenResponse = await fetch(`${apiUrl}/api/accessTokens`, {
        method: 'POST',
        body: JSON.stringify({ name: 'BNR34' }),
        headers: {
          authorization: ADMIN,
          'Content-Type': 'application/json'
        }
      })
      const { id } = await tokenResponse.json()
      const mappingResponse = await fetch(`${apiUrl}/api/mappings`, {
        headers: {
          access: 'incorrect token',
          'Content-Type': 'application/json'
        }
      })
      expect(mappingResponse.status).toEqual(401)
      await fetch(`${apiUrl}/api/accessTokens/${id}`, {
        method: 'DELETE',
        headers: {
          authorization: ADMIN
        }
      })
    })
  })
})
