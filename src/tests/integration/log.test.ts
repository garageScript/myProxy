import { startAppServer } from '../../server/server'
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
    const fullDomain = 'Cloud.Walker.com'
    const logResponse = await logAdapter(`/stdout/${fullDomain}`, 'GET')
    expect(logResponse.status).toEqual(200)
  })

  it('checks that error logs endpoint exists', async () => {
    const fullDomain = 'Luke.Walker.com'
    const logResponse = await logAdapter(`/stderr/${fullDomain}`, 'GET')
    expect(logResponse.status).toEqual(200)
  })

  it('checks that unknown stream param returns an error', async () => {
    const fullDomain = 'Luke.Walker.com'
    const logResponse = await logAdapter(`/somestream/${fullDomain}`, 'GET')
    expect(logResponse.status).toEqual(400)
  })
})
