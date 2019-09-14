import 'dotenv/config'
import express from 'express'
import path from 'path'
import crypto from 'crypto'
import cookieParser from 'cookie-parser'
import { adminRouter } from './admin/index'
import { apiRouter } from './api/index'
import https from 'https'
import fs from 'fs'
import { execSync } from 'child_process'
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
  const hashPass = (password: string): string => {
    return crypto
      .createHash('sha256')
      .update(password)
      .digest('hex')
  }
  const password = hashPass(process.env.ADMIN as string)
  const adminPass = hashPass(req.body.adminPass as string)

  if (password === adminPass) {
    res.cookie('adminPass', adminPass, { httpOnly: true })
    return res.redirect('/admin')
  }

  return res.render('login', { error: 'Wrong Admin Password' })
})

const listener = (): void => {
  const cyan = '\x1b[36m\u001b[1m%s\x1b[0m'
  const red = '\x1b[31m\u001b[1m%s\x1b[0m'
  if (!process.env.ADMIN) {
    return console.log(red, 'Admin UI/API is turned off')
  }
  app.listen(port, () =>
    console.log(cyan, `myProxy is running on port ${port}!`)
  )
}

const server = https.createServer(
  {
    SNICallback: (domain, cb) => {
      // using whoami will return root because app is run with sudo
      domain = 'albertow.com'
      const adminUser = execSync('logname')
        .toString()
        .trim()
      const homePath = process.env.HOME 
      // escape characters required or readFileSync will not find file
      const secureContext = tls.createSecureContext({
        /* eslint-disable */
        key: fs.readFileSync(
          `${homePath}/\.acme\.sh/*\.${domain}/*\.${domain}\.key`
        ),
        cert: fs.readFileSync(
          `${homePath}/\.acme\.sh/*\.${domain}/*\.${domain}\.cer`
        )
        /* eslint-enable */
      })
      if (cb) return cb(null, secureContext)
      return secureContext
    }
  },
  (req, res) => {
    res.end('hello world')
  }
)
server.listen(443)

listener()
