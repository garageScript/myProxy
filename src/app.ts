import { startAppServer, startProxyServer } from './server/server'

startAppServer(process.env.PORT || 3000, process.env.ADMIN)
if (process.env.NODE_ENV === 'production') {
  startProxyServer(process.env.HOME)
}
