import { startAppServer } from '../../server/server'
import fetch from 'node-fetch'

const TEST_PORT = process.env.PORT || 5002
const ADMIN = process.env.ADMIN || '123'

const reqHeaders = {
  authorization: ADMIN,
  'Content-Type': 'application/json'
}

describe('api/status', () => {
  let server

  beforeAll(async () => {
    server = await startAppServer(TEST_PORT, ADMIN)
  })

  afterAll(() => {
    server.close()
  })

  it('Server should return empty array when no domains are specified', async () => {
    const res = await fetch(`http://localhost:${TEST_PORT}/api/status`, {
      headers: reqHeaders
    })

    const data = await res.json()
    expect(data).toStrictEqual({ stdout: [] })
    expect(res.status).toEqual(200)
  })
})
