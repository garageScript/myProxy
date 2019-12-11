/* eslint @typescript-eslint/camelcase: 0 */
import express from 'express'
import uuidv4 from 'uuid/v4'
import { AccessToken } from '../types/general'
import { setData, getAccessTokens } from '../lib/data'

const accessTokensRouter = express.Router()

accessTokensRouter.post('/', (req, res) => {
  const allAccessTokens = getAccessTokens()
  if (req.body.name.length < 2) {
    return res.status(400).json({
      message: 'invalid name'
    })
  }
  const tokensObject: AccessToken = {
    name: req.body.name,
    id: `${uuidv4()}`
  }
  const existingToken = allAccessTokens.find(e => e.name === tokensObject.name)
  if (existingToken)
    return res.status(400).json({
      message: 'This token already exits'
    })
  allAccessTokens.push(tokensObject)
  setData('apiTokens', allAccessTokens)
  res.json(tokensObject)
})

accessTokensRouter.get('/', (req, res) => {
  const tokens = getAccessTokens()
  res.json(tokens)
})

export default accessTokensRouter
