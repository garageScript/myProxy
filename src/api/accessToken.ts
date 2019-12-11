/* eslint @typescript-eslint/camelcase: 0 */
import express from 'express'
import uuidv4 from 'uuid/v4'
import { AccessToken } from '../types/general'
import { setData, getAccessTokens } from '../lib/data'

const accessTokensRouter = express.Router()

accessTokensRouter.post('/', (req, res) => {
  if (req.body.name.length < 2) {
    return res.status(400).json({
      message: 'invalid name'
    })
  }
  const allAccessTokens = getAccessTokens()
  const existingToken = allAccessTokens.find(e => e.name === req.body.name)
  if (existingToken) {
    return res.status(400).json({
      message: 'This token already exits'
    })
  }
  const tokensObject: AccessToken = {
    name: req.body.name,
    id: `${uuidv4()}`
  }
  allAccessTokens.push(tokensObject)
  setData('apiTokens', allAccessTokens)
  res.json(tokensObject)
})

accessTokensRouter.get('/', (req, res) => {
  const tokens = getAccessTokens()
  res.json(tokens)
})

export default accessTokensRouter
