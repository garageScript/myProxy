import { startAppServer, startProxyServer } from './server/server'
import environment from './helpers/environment'

const { PORT, ADMIN_PASS, isProduction } = environment

startAppServer(PORT, ADMIN_PASS)

/**
 * Proxy Server will create SSL Certificates on the server
 * for your domains in production.
 * Development mode do not have to run the proxy server.
 * */
if (isProduction()) startProxyServer()
