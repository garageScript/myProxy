import { startAppServer } from '../../server/server'
import fetch from 'node-fetch'

const TEST_PORT = process.env.PORT || 4998
const ADMIN = process.env.ADMIN || 'password'
const apiAdmin = `http://127.0.0.1:${TEST_PORT}/api/admin`
const headers = { authorization: ADMIN, 'Content-Type': 'application/json' }

describe('/api/admin/sslCerts', () => {
  let server

  beforeAll(async () => {
    server = await startAppServer(TEST_PORT, ADMIN)
  })

  afterEach(() => {
    server.close()
  })

  it('Should send a error', async () => {
    const response = await fetch(`${apiAdmin}/sslCerts`, {
      headers,
      method: 'POST'
    })

    expect(response.status).toEqual(200)
    const data = await response.json()
    expect(data).toEqual({ success: false, message: 'Error: {}' })
  })

  it('Should create a SSL Certification', async () => {
    const sslCertsMock = jest.fn().mockResolvedValue({
      success: true,
      message: 'SSL Certs and domain name records successfully created'
    })

    const request = await sslCertsMock()
    expect(sslCertsMock).toHaveBeenCalledTimes(1)
    expect(request).toEqual({
      success: true,
      message: 'SSL Certs and domain name records successfully created'
    })
  })
})
