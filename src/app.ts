import { startAppServer, startProxyServer } from './server/server'

startAppServer()
if(process.env.NODE_ENV === 'production'){
  startProxyServer()
}
