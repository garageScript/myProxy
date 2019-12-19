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
    it('Mappings should respond with 200 if token matches', async () => {
      const createTokenResponse = await fetch(`${apiUrl}/api/accessTokens`, {
        method: 'POST',
        headers: {
          authorization: ADMIN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'PaulWalker' })
      })
      const token = await createTokenResponse.json()
      const fetchResponse = await fetch(`${apiUrl}/api/mappings`, {
        headers: {
          access: token.id
        }
      })
      expect(fetchResponse.status).toEqual(200)
      await fetch(`${apiUrl}/api/accessTokens/${token.id}`, {
        method: 'DELETE',
        headers: {
          authorization: ADMIN
        }
      })
    })
    it('Admin should respond with 401 with token ', async () => {
      const createTokenResponse = await fetch(`${apiUrl}/api/accessTokens`, {
        method: 'POST',
        headers: {
          authorization: ADMIN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'PaulWalker' })
      })
      const token = await createTokenResponse.json()
      const fetchResponse = await fetch(`${apiUrl}/api/admin/providerKeys`, {
        headers: {
          access: token.id
        }
      })
      expect(fetchResponse.status).toEqual(401)
      await fetch(`${apiUrl}/api/accessTokens/${token.id}`, {
        method: 'DELETE',
        headers: {
          authorization: ADMIN
        }
      })
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
})
