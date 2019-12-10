import { startAppServer } from '../../server/server'
import uuidv4 from 'uuid/v4'
import { accessTokensAdapter } from '../helpers/accessTokensAdapter'

const TEST_PORT = process.env.PORT || 50605
const ADMIN = process.env.ADMIN || 'hjhj'

describe('/api/accessTokens', () => {
  let server

  beforeAll(async () => {
    server = await startAppServer(TEST_PORT, ADMIN)
  })

  afterAll(() => {
    server.close()
  })

  it('checks to see if accesstoken is created', async () => {
    const name = 'c0d3access'
    const postResponse = await accessTokensAdapter('/', 'POST', {
      name
    })
    const postAccessToken = await postResponse.json()
    console.log('PostAccessToken:', postAccessToken)
    expect(postAccessToken.name).toEqual(name)
  })
})
