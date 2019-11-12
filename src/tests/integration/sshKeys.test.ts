import { startAppServer } from '../../server/server'
import fetch from 'node-fetch'

const TEST_PORT = process.env.PORT || 5001
const ADMIN = process.env.ADMIN || '123'

const reqHeaders = {
  authorization: ADMIN,
  'Content-Type': 'application/json'
}

describe('/api/sshKeys', () => {
  let server

  beforeAll(async () => {
    server = await startAppServer(TEST_PORT, ADMIN)
  })

  afterAll(() => {
    server.close()
  })

  it('checking SSH keys can be retrieved', async () => {
    const res = await fetch(`http://localhost:${TEST_PORT}/api/sshKeys`, {
      headers: reqHeaders
    })
    const data = await res.json()
    expect(res.status).toEqual(200)
    expect(data).toBeInstanceOf(Array)
  })

  it('check if SSH keys can be added', async () => {
    const res = await fetch(`http://localhost:${TEST_PORT}/api/sshKeys`, {
      method: 'POST',
      body: JSON.stringify({
        key: 'ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAkl schacon@mylaptop.local'
      }),
      headers: reqHeaders
    })
    const data = await res.json()
    expect(res.status).toEqual(200)
    expect(data).toStrictEqual(['schacon@mylaptop.local'])
  })

  it('check if SSH keys can be deleted', async () => {
    const res = await fetch(`http://localhost:${TEST_PORT}/api/sshKeys`, {
      method: 'DELETE',
      body: JSON.stringify({
        id: 0
      }),
      headers: reqHeaders
    })

    const data = await res.json()
    expect(res.status).toEqual(200)
    expect(data).toStrictEqual([])
  })
})
