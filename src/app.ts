import 'dotenv/config'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import { adminRouter } from './admin/index'
import { apiRouter } from './api/index'
import { isCorrectCredentials } from './auth'

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
  const { adminPass } = req.body
  if (isCorrectCredentials(adminPass)) {
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

listener()
