import express from 'express'
import path from 'path'
import https from 'https'
import cookieParser from 'cookie-parser'
import { adminRouter } from './admin/index'
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

app.use(express.urlencoded())
app.use(cookieParser())
app.use('/admin', adminRouter)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../../src/views'))

app.get('/admin/domains', (_, res) => {
  // List of domains will be sent to the frontend (JSON)
  https
    .request(options, response => {
      response.on('data', data => res.json(JSON.parse(data)))
    })
    .on('error', err => res.json(JSON.parse(err.message)))
    .end()
})

app.get('/', (req, res) => res.render('client'))

app.post('/login', (req, res) => {
  if (process.env.ADMIN !== req.body.adminPass)
    return res.render('login', { error: 'Wrong Admin Password' })
  res.cookie('adminPass', req.body.adminPass)
  res.redirect('/admin/serviceHostKeys')
})

app.listen(port, () => console.log(`app listening on port ${port}!`))
