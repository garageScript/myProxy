import express from 'express'
import path from 'path'

const app = express()
const port: String | number = process.env.PORT || 3000
const apiRouter = require('./api/index')

app.use(express.json())
app.use('/api', apiRouter)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../../src/views'))

app.get('/login', (req, res) => res.render('login', { error: '' }))
app.get('/', (req, res) => res.render('client'))

app.post('/login', (req, res) => {
  if (process.env.ADMIN !== req.body.adminPass)
    return res.render('login', { error: 'Wrong Admin Password' })
  res.cookie('adminPass', req.body.adminPass)
  res.redirect('/admin/serviceHostKeys')
})

app.get('/', (req, res) => res.render('index', { message: 'Hello myProxy' }))

app.listen(port, () => console.log(`app listening on port ${port}!`))
