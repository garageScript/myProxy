import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import { adminRouter } from './admin/index'
import { services } from './services'
const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded())
app.use(cookieParser())
// app.use('/admin', adminRouter)
app.use('/services', services)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../../src/views'))

app.get('/', (req, res) => res.render('client'))

app.post('/login', (req, res) => {
  if (process.env.ADMIN !== req.body.adminPass)
    return res.render('login', { error: 'Wrong Admin Password' })
  res.cookie('adminPass', req.body.adminPass)
  res.redirect('/admin/serviceHostKeys')
})

app.listen(port, () => console.log(`app listening on port ${port}!`))
