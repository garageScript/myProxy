/* eslint @typescript-eslint/camelcase: 0 */
import express from 'express'
import uuidv4 from 'uuid/v4'
import { AccessToken } from '../types/general'
import { setData, getAccessTokens } from '../lib/data'

const accessTokensRouter = express.Router()

accessTokensRouter.post('/accessTokens', (req, res) => {
  const allApiTokens = getAccessTokens()
  const tokensObject: AccessToken = {
    name: req.body.name,
    id: `${uuidv4()}`
  }
  allApiTokens.push(tokensObject)
  setData('apiTokens', allApiTokens)
  res.json(tokensObject)
})

export default accessTokensRouter
