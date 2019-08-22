import express from 'express'
import path from 'path'

const app = express()
const port: String | number = process.env.PORT || 3000
const apiRouter = require('./api/index')
console.log('api', apiRouter)

app.use(express.json())
app.use('/api', apiRouter)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../../src/views'))

app.get('/', (req, res) => res.render('client'))

app.get('/admin/serviceHostKeys', (req, res) => {
  res.render('admin')
})

app.listen(port, () => console.log(`app listening on port ${port}!`))
