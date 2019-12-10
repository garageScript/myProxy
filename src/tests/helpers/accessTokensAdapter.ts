const TEST_PORT = process.env.PORT || 50605
const ADMIN = process.env.ADMIN || 'hjhj'
const apiURL = `http://127.0.0.1:${TEST_PORT}`
import { Options, Headers } from '../../types/tests'
import fetch, { Response } from 'node-fetch'

const reqHeaders: Headers = {
  authorization: ADMIN,
  'Content-Type': 'application/json'
}

const accessTokensAdapter = (
  path = '/',
  method: string,
  body?: object
): Promise<Response> => {
  const options: Options = {
    method,
    headers: reqHeaders
  }
  if (body) {
    options.body = JSON.stringify(body)
  }
  return fetch(`${apiURL}/api/accessTokens${path}`, options)
}

export { accessTokensAdapter }
