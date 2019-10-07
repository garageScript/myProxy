import { startAppServer } from '../../server/server'
import fetch from 'node-fetch'

const TEST_PORT = process.env.PORT || 50604
const ADMIN = process.env.ADMIN || 'hjhj'
const apiURL = `http://127.0.0.1:${TEST_PORT}`

describe('/api', () =>{
  let server 

  beforeAll(async ()=>{
    server = await startAppServer(TEST_PORT, ADMIN)
  })

  afterAll(()=>{
    server.close()
  })

  it('checks mappings for newly added mapping', async()=>{
    await fetch(`${apiURL}/api/mappings`, {
      method: 'POST', 
      headers: {
        authorization: ADMIN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        domain: 'Rahul',
        subdomain: 'testing',
        port: '5678'

      })
    }).then(r => r.json()
    ).then((data)=>{
      expect(data.port).toEqual('5678')
    })
  })
})
