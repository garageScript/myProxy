import { startAppServer } from '../server/server'

describe('server', () => {
  const port = 4000
  const adminPass = 'password'

  it('Should run server and return a promise', async () => {
    const server = await startAppServer(port, adminPass)
    expect(server).resolves.toMatchObject
  })
})