import { startAppServer, startProxyServer } from './server/server'

const ENV = process.env.NODE_ENV || 'development'
const PORT = process.env.PORT || 3000
const ADMIN_PASS = process.env.ADMIN || null
const HOME = process.env.HOME || null

startAppServer(PORT, ADMIN_PASS)

/**
 * Proxy Server will create SSL Certificates on the server
 * for your domains in production.
 * Development mode do not have to run the proxy server.
 * */
if (ENV === 'production') startProxyServer(HOME)
