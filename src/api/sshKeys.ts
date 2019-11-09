import express from 'express'

import { authorizedKeys, addAuthorizedKey } from '../helpers/authorizedKeys'

const sshKeyRouter = express.Router()

// The steps below are covered by the setup script. This is not necessssary.
/* 
  if (!fs.existsSync(`${userHomeDirectory}/.ssh`)) {
    fs.mkdirSync(`${userHomeDirectory}/.ssh`, { recursive: true })
  }
*/

sshKeyRouter.get('/', (req, res) => {
  res.json(authorizedKeys)
})

sshKeyRouter.post('/', (req, res) => {
  const { id, key } = req.body
  addAuthorizedKey(id, key)
  res.json(authorizedKeys)
})

export default sshKeyRouter
