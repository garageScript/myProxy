/* eslint @typescript-eslint/camelcase: 0 */
import express from 'express'
import uuidv4 from 'uuid/v4'
import { ApiTokens } from '../types/general'
import { setData, getApiTokens } from '../lib/data'

const apiTokenRouter = express.Router()

apiTokenRouter.post('/api/tokens', (req, res) => {
  const allApiTokens = getApiTokens()
  const tokensObject: ApiTokens = {
    name: req.body.name,
    id: `${uuidv4()}`
  }
  allApiTokens.push(tokensObject)
  setData('apiTokens', allApiTokens)
  res.json(tokensObject)
})

export default apiTokenRouter
