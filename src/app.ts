import express from 'express'
import path from 'path'
const app = express()
const port = process.env.PORT || 3000
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../../src/views'))
app.use(express.static(`${__dirname}`))

app.get('/', (req, res) => res.render('client'))

app.get('/admin/serviceHostKeys', (req, res) => {
  res.render('admin')
})

app.listen(port, () => console.log(`app listening on port ${port}!`))
