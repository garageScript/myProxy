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
    const name = `c0d3access${uuidv4()}`
    const postResponse = await accessTokensAdapter('/', 'POST', {
      name
    })
    const postAccessToken = await postResponse.json()
    expect(postAccessToken.name).toEqual(name)
  })
  it('checks to see if dupicate names are not created', async () => {
    const firstName = `c0d3access${uuidv4()}`
    const postResponse = await accessTokensAdapter('/', 'POST', {
      name: firstName
    })
    expect(postResponse.status).toEqual(200)
    const secondName = firstName
    const duplicatePostResponse = await accessTokensAdapter('/', 'POST', {
      name: secondName
    })
    expect(duplicatePostResponse.status).toEqual(400)
  })
})
