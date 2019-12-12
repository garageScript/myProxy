const TEST_PORT = process.env.PORT || 50608
const ADMIN = process.env.ADMIN || '123'
const apiURL = `http://127.0.0.1:${TEST_PORT}`
import { Options, Headers } from '../../types/tests'
import fetch, { Response } from 'node-fetch'

const reqHeaders: Headers = {
  authorization: ADMIN,
  'Content-Type': 'application/json'
}

const logAdapter = (
  path = '/',
  method: string,
  body?: object
): Promise<Response> => {
  const options: Options = {
    method,
    headers: reqHeaders
  }
  return fetch(`${apiURL}/api/logs${path}`, options)
}

export { logAdapter }
