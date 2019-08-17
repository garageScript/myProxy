import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
const app = express()
const port = process.env.PORT || 3000
app.use(express.urlencoded())
app.use(cookieParser())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../../src/views'))

app.get('/', (req, res) => res.render('index', { message: 'Hello World' }))
app.get('/login', (req, res) => res.render('login', { error: '' }))
app.post('/login', (req, res) => {
  if(process.env.ADMIN !== req.body.adminPass) return res.render('login', { error: 'Wrong Admin Password' })
  res.cookie('adminPass', req.body.adminPass)
  res.redirect('/admin/serviceHostKeys')
})

app.get('/admin/serviceHostKeys', (req, res) => {
  if(!req.cookies.adminPass) return res.redirect('/login')
  res.render('admin')
})

app.listen(port, () => console.log(`app listening on port ${port}!`))
