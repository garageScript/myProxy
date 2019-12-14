import { startAppServer } from '../../server/server'
import uuidv4 from 'uuid/v4'
import { logAdapter } from '../helpers/logAdapter'

const TEST_PORT = process.env.PORT || 50608
const ADMIN = process.env.ADMIN || '123'

describe('/api/logs', () => {
  let server

  beforeAll(async () => {
    server = await startAppServer(TEST_PORT, ADMIN)
  })

  afterAll(() => {
    server.close()
  })

  it('checks that output logs endpoint exists', async () => {
    const subDomain = 'Cloud'
    const domain = 'Walker'
    const logResponse = await logAdapter(`/out/${subDomain}.${domain}`, 'GET')
    expect(logResponse.status).toEqual(200)
  })

  it('checks that error logs endpoint exists', async () => {
    const subDomain = 'Luke'
    const domain = 'Walker'
    const logResponse = await logAdapter(`/err/${subDomain}.${domain}`, 'GET')
    expect(logResponse.status).toEqual(200)
  })

  it('checks the delete endpoint exists', async () => {
    const fullDomain = `${uuidv4()}.walker.com`
    const logResponse = await logAdapter(`/${fullDomain}`, 'DELETE')
    expect(logResponse.status).toEqual(200)
  })
})
