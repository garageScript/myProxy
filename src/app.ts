import { startAppServer, startProxyServer } from './server/server'
import dotEnv from './helpers/dotEnv'

const { PORT, ADMIN_PASS, ENV, HOME } = dotEnv

startAppServer(PORT, ADMIN_PASS)

/**
 * Proxy Server will create SSL Certificates on the server
 * for your domains in production.
 * Development mode do not have to run the proxy server.
 * */
if (ENV === 'production') startProxyServer(HOME)
