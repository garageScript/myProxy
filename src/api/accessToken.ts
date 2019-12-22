/* eslint @typescript-eslint/camelcase: 0 */
import express, { Response, NextFunction } from 'express'
import uuidv4 from 'uuid/v4'
import { AccessToken, AuthenticatedRequest } from '../types/general'
import { setData, getAccessTokens } from '../lib/data'

const accessTokensRouter = express.Router()

accessTokensRouter.use(
  (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user.isAdmin) {
      res.status(401).send('Unauthorized')
      return
    }
    return next()
  }
)

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
  setData('accessTokens', allAccessTokens)
  res.json(tokensObject)
})

accessTokensRouter.get('/', (req, res) => {
  const tokens = getAccessTokens()
  res.json(tokens)
})

accessTokensRouter.get('/:id', (req, res) => {
  const tokens = getAccessTokens()
  const found = tokens.find(t => t.id === req.params.id)
  res.json(found || {})
})

accessTokensRouter.delete('/:id', (req, res) => {
  const tokens = getAccessTokens()
  tokens.find((e, i) => {
    if (e.id === req.params.id) {
      tokens.splice(i, 1)
      res.json(e)
      return true
    }
  })
  setData('accessTokens', tokens)
})

export default accessTokensRouter
