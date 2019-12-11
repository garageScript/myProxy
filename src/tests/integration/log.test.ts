import { startAppServer } from '../../server/server'
import { logAdapter } from '../helpers/logAdapter'

const TEST_PORT = process.env.PORT || 50605
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
    const port = '25132'
    const postResponse = await logAdapter('/', 'POST', 'mappings', {
      domain,
      subDomain,
      port
    })

    const postMapping = await postResponse.json()

    const logResponse = await logAdapter(
      `/out/${postMapping.fullDomain}`,
      'GET',
      'logs'
    )

    expect(logResponse.status).toEqual(200)

    await logAdapter(`/${postMapping.id}`, 'DELETE', 'mappings')
  })

  it('checks that error logs endpoint exists', async () => {
    const subDomain = 'Cloud'
    const domain = 'Walker'
    const port = '25132'
    const postResponse = await logAdapter('/', 'POST', 'mappings', {
      domain,
      subDomain,
      port
    })

    const postMapping = await postResponse.json()

    const logResponse = await logAdapter(
      `/err/${postMapping.fullDomain}`,
      'GET',
      'logs'
    )

    expect(logResponse.status).toEqual(200)

    await logAdapter(`/${postMapping.id}`, 'DELETE', 'mappings')
  })
})
