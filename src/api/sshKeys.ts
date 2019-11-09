import express from 'express'
import fs from 'fs'
import os from 'os'

import {
  authorizedKeys,
  addAuthorizedKey,
  setAuthorizedKeys
} from '../helpers/authorizedKeys'

const userHomeDirectory = os.homedir()
const sshKeyRouter = express.Router()

// The steps below are covered by the setup script. This is not necessssary.
/* 
  if (!fs.existsSync(`${userHomeDirectory}/.ssh`)) {
    fs.mkdirSync(`${userHomeDirectory}/.ssh`, { recursive: true })
  }
*/

sshKeyRouter.get('/', (req, res) => {
  // Read from file if authorizedKeys is empty
  if (!authorizedKeys) {
    fs.readFile(`${userHomeDirectory}/.ssh/authorized_keys`, (error, data) => {
      if (error) {
        console.log(error)
      }
      const keysObj = {}
      data
        .toString()
        .split('\n')
        .filter(e => e !== '')
        .forEach((item, index) => {
          keysObj[`default+${index}`] = item
        })
      setAuthorizedKeys(keysObj)
    })
  }
  res.json(authorizedKeys)
})

sshKeyRouter.post('/add', (req, res) => {
  const { id, key } = req.body
  addAuthorizedKey(id, key)
  res.json(authorizedKeys)
})

export default sshKeyRouter
