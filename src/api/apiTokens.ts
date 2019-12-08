/* eslint @typescript-eslint/camelcase: 0 */
import express from 'express'
import uuid4 from 'uuid/v4'
import { ApiTokens } from '../types/general'
import { getApiTokens } from '../lib/data'

const apiTokenRouter = express.Router()

apiTokenRouter.post('/', (req, res) => {
  const allApiTokens = getApiTokens()
})
