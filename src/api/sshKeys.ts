import express from 'express'

import {
  authorizedKeys,
  addAuthorizedKey,
  removeAuthorizedKey
} from '../helpers/authorizedKeys'

const sshKeyRouter = express.Router()

sshKeyRouter.get('/', (req, res) => {
  res.json(authorizedKeys)
})

sshKeyRouter.post('/', (req, res) => {
  const { id, key } = req.body
  addAuthorizedKey(id, key)
  res.json(authorizedKeys)
})

sshKeyRouter.delete('/', (req, res) => {
  const { id } = req.body
  removeAuthorizedKey(id)
  res.json(authorizedKeys)
})

export default sshKeyRouter
