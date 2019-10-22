import 'dotenv/config'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import { adminRouter } from '../admin/index'
import { apiRouter } from '../api/index'
import { hashPass } from '../helpers/crypto'
import https from 'https'
import fs from 'fs'
import tls from 'tls'
import { getAvailableDomains, getMappings } from '../lib/data'
import { setupAuth, isCorrectCredentials } from '../auth'
import httpProxy from 'http-proxy'
import { ProxyMapping } from '../types/general'

const cyan = '\x1b[36m\u001b[1m%s\x1b[0m'
const red = '\x1b[31m\u001b[1m%s\x1b[0m'
const warningMsg = 'WARNING! You have to setup ADMIN password first before to run the app.'

const startAppServer = (
  port: string | number,
  adminPass: string
): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    if (!adminPass) return console.error(red, warningMsg)

    const app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser())
    app.use(express.static(path.join(__dirname, '../public')))
    app.use('/admin', adminRouter)
    app.use('/api', setupAuth(adminPass), apiRouter)
    app.set('view engine', 'ejs')
    app.set('views', path.join(__dirname, '../../views'))

    app.get('/', setupAuth(adminPass), (_, res) =>
      getAvailableDomains().length > 0
        ? res.render('client')
        : res.redirect('/admin')
    )
    app.get('/login', (req, res) => res.render('login', { error: '' }))

    app.post('/login', (req, res) => {
      if (isCorrectCredentials(req.body.adminPass, adminPass)) {
        res.cookie('adminPass', hashPass(adminPass), { httpOnly: true })
        return res.redirect('/admin')
      }

      return res.render('login', { error: 'Wrong Admin Password' })
    })

    const server = app.listen(port, () => {
      console.log(cyan, `myProxy is running on port ${port}!`)
      resolve(server)
    })
  })
}

const startProxyServer = (homePath: string): void => {
  const proxy = httpProxy.createProxyServer({})
  proxy.on('error', err => {
    console.error('Proxy error', err)
  })

  const server = https.createServer(
    {
      SNICallback: (host, cb) => {
        // escape characters required or readFileSync will not find file
        /* eslint-disable */
        const filteredHost = host.split('.')
        const [domain, topLevelDomain] = filteredHost.slice(
          filteredHost.length - 2,
          filteredHost.length
        )
        const filteredDomain = `${domain}.${topLevelDomain}`

        const certPath =
          filteredHost.length > 2
            ? `${homePath}/\.acme\.sh/*\.${filteredDomain}/fullchain.cer`
            : `${homePath}/\.acme\.sh/${filteredDomain}/fullchain.cer`
        const keyPath =
          filteredHost.length > 2
            ? `${homePath}/\.acme\.sh/*\.${filteredDomain}/*\.${filteredDomain}\.key`
            : `${homePath}/\.acme\.sh/${filteredDomain}/${filteredDomain}\.key`
        const secureContext = tls.createSecureContext({
          /* eslint-disable */
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath)
          /* eslint-enable */
        })
        if (cb) return cb(null, secureContext)
        return secureContext
      }
    },
    (req, res) => {
      try {
        const mappings = getMappings()
        const { ip, port }: ProxyMapping =
          mappings.find(({ subDomain, domain }) => {
            return `${subDomain}.${domain}` === req.headers.host
          }) || {}
        if (!port || !ip) return res.end('Not Found')
        proxy.web(req, res, { target: `http://${ip}:${port}` }, err => {
          console.error('Error communicating with server', err)
          res.end(
            `Error communicating with server that runs ${req.headers.host}`
          )
        })
      } catch (err) {
        console.error('Error: proxy failed', err)
        return res.end(`Error: failed to create proxy ${req.headers.host}`)
      }
    }
  )
  server.listen(443)

  const httpApp = express()
  httpApp.get('/*', (req, res) => {
    const paramCheck = req.headers.host.split('?')[1]
    const params = paramCheck ? `?${paramCheck}` : ''
    res.redirect(`https://${req.headers.host}${req.path}${params}`)
  })
  httpApp.listen(80)
}

export { startProxyServer, startAppServer }
