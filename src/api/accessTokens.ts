/* eslint @typescript-eslint/camelcase: 0 */
import express from 'express'
import uuidv4 from 'uuid/v4'
import { AccessToken } from '../types/general'
import { setData, getAccessTokens } from '../lib/data'

const accessTokensRouter = express.Router()

accessTokensRouter.post('/', (req, res) => {
  const allAccessTokens = getAccessTokens()
  const tokensObject: AccessToken = {
    name: req.body.name,
    id: `${uuidv4()}`
  }
  allAccessTokens.push(tokensObject)
  setData('apiTokens', allAccessTokens)
  res.json(tokensObject)
})

accessTokensRouter.get('/', (req, res) => {
  res.json([
    {
      name: 'hello world'
    }
  ])
})

export default accessTokensRouter
