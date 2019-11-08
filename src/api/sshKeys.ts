import express from 'express'
import fs from 'fs'
import os from 'os'
const userHomeDirectory = os.homedir()
console.log('userHomeDirectory:', userHomeDirectory)
const sshKeyRouter = express.Router()

if (!fs.existsSync(`${userHomeDirectory}/.ssh`)) {
  fs.mkdirSync(`${userHomeDirectory}/.ssh`, { recursive: true }) 
}

sshKeyRouter.get('/', (req, res) => {
  fs.readFile(`${userHomeDirectory}/.ssh/authorized_keys`, (error, data) => {
    if(error||!data || !data.toString) return res.json([])
    const keysArray = data.toString().split('\n').filter((e) =>{return e.length > 2})
    res.json(keysArray)
  })
})

export default sshKeyRouter
