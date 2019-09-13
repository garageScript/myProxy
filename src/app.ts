import 'dotenv/config'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import { adminRouter } from './admin/index'
import { apiRouter } from './api/index'
import https from 'https'
import fs from 'fs'
import {execSync} from 'child_process'
import tls from 'tls'

const app = express()
const port: string | number = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/admin', adminRouter)
app.use('/api', apiRouter)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))

app.get('/', (req, res) => res.render('client'))
app.get('/login', (req, res) => res.render('login', { error: '' }))

app.post('/login', (req, res) => {
  if (process.env.ADMIN !== req.body.adminPass)
    return res.render('login', { error: 'Wrong Admin Password' })
  res.cookie('adminPass', req.body.adminPass)
  res.redirect('/admin')
})

const listener = (): void => {
  if (!process.env.ADMIN) {
    return console.log('Admin UI/API is turned off')
  }
  app.listen(port, () => console.log(`app listening on port ${port}!`))
}

const server = https.createServer({
  SNICallback: (domain, cb) => {
    // using whoami will return root because app is run with sudo
    const adminUser = execSync('logname').toString().trim()
    // unecessary escape error appears for eslint-disable-next-line
    const secureContext =  tls.createSecureContext({
      /* eslint-disable */
      key: fs.readFileSync(`/home/${adminUser}/\.acme\.sh/*\.${domain}/*\.${domain}\.key`),
      cert: fs.readFileSync(`/home/${adminUser}/\.acme\.sh/*\.${domain}/*\.${domain}\.cer`),
      /* eslint-enable */
    })
    if(cb) return cb(null, secureContext)
    return secureContext
  }}, (req, res) => {
    res.end('hello world')
  });
server.listen(443)

listener()
