import express from 'express'
import path from 'path'

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/admin/serviceHostKeys', (req, res) => {
  res.sendFile(`${path.join(__dirname, '../../src/public/admin.html')}`)
})

app.listen(port, () => console.log(`app listening on port ${port}!`))
