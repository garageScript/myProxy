import express from 'express'
import path from 'path'
import https from 'https'
const app = express()
const port = process.env.PORT || 3000

// godaddy API_FROM_DB (JSON)
// KEY and SECRET are on server within README.md
const service = 'api.godaddy.com'
const key = process.env.KEY
const secret = process.env.SECRET
const options = {
  host: service,
  path: '/v1/domains?statuses=ACTIVE',
  headers: { Authorization: `sso-key ${key}:${secret}` }
}

app.get('/admin/domains', (_, res) => {
  // List of domains will be sent to the frontend (JSON)
  https
    .request(options, response => {
      response.on('data', data => res.json(JSON.parse(data)))
    })
    .on('error', err => res.json(JSON.parse(err.message)))
    .end()
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../../src/views'))

app.get('/', (req, res) => res.render('client'))

app.get('/admin/serviceHostKeys', (req, res) => {
  res.render('admin')
})

app.listen(port, () => console.log(`app listening on port ${port}!`))
