import util from 'util'
import cp from 'child_process'
import express from 'express'

const app = express.Router()
const exec = util.promisify(cp.exec)

const gdKey = '123'
const gdSecret = '456'

app.post('/sslCerts', async (req, res) => {
  try {
    const { stdout, stderr } = await exec(
      `GD_Key=${gdKey} GD_Secret=${gdSecret} ./acme.sh/acme.sh --issue --dns dns_gd -d dummydomain.com -d www.dummydomain.com`
    )
    if (stderr) {
      console.log('stderr', stderr)
    }
    console.log('stdout', stdout)
  } catch (err) {
    console.log('failed to create cert', err)
  }
  res.json('cert successfully created')
})
