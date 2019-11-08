import express from 'express'
import fs from 'fs'
const sshKeyRouter = express.Router()

sshKeyRouter.get('/', (req, res) => {
  //res.json([])
  fs.readFile('/home/noob101/.ssh/authorized_keys', (error, data) => {
    console.log('error:', error)
    console.log('data:', data.toString().split('\n'))
    res.json(data.toString().split('\n'))
  })
})

export default sshKeyRouter
