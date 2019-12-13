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

  it('should create an access token successfully', async () => {
    const name = `c0d3access${uuidv4()}`

    const postResponse = await accessTokensAdapter('/', 'POST', {
      name
    })
    const postAccessToken = await postResponse.json()
    expect(postAccessToken.name).toEqual(name)
    const getTokens = await accessTokensAdapter('/', 'GET').then(r => r.json())
    const foundToken = getTokens.find(e => e.name === name)
    expect(foundToken.name).toEqual(name)
  })

  it('should not allow dulplicate tokens', async () => {
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
    const updatedTokens = await accessTokensAdapter('/', 'GET').then(r =>
      r.json()
    )
    const allTokens = updatedTokens.filter(e => e.name === firstName)
    expect(allTokens.length).toEqual(1)
  })

  it('should delete the token', async () => {
    const name = `c0d3accessDELETE${uuidv4()}`
    const postResponse = await accessTokensAdapter('/', 'POST', {
      name
    })
    expect(postResponse.status).toEqual(200)

    const postResult = await postResponse.json()
    const selectedToken = await accessTokensAdapter(
      `/${postResult.id}`,
      'GET'
    ).then(r => r.json())
    expect(selectedToken.name).toEqual(name)

    const deleteToken = await accessTokensAdapter(`/${postResult.id}`, 'DELETE')
    const postDeleteResult = await deleteToken.json()
    expect(postResult.name).toEqual(postDeleteResult.name)

    const allTokens = await accessTokensAdapter('/', 'GET').then(r => r.json())
    const findDeletedToken = allTokens.find(e => e.name === postResult.name)
    expect(findDeletedToken).toEqual(undefined)
  })
})
