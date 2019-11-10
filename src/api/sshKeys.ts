import express from 'express'

import {
  authorizedKeys,
  addAuthorizedKey,
  removeAuthorizedKey
} from '../helpers/authorizedKeys'

const sshKeyRouter = express.Router()

sshKeyRouter.get('/', (req, res) => {
  res.json(authorizedKeys.map(v => v.split(' ')[2]))
})

sshKeyRouter.post('/', (req, res) => {
  const { key } = req.body
  addAuthorizedKey(key)
  res.json(authorizedKeys.map(v => v.split(' ')[2]))
})

sshKeyRouter.delete('/', (req, res) => {
  const { id } = req.body
  removeAuthorizedKey(id)
  res.json(authorizedKeys.map(v => v.split(' ')[2]))
})

export default sshKeyRouter
