const TEST_PORT = process.env.PORT || 50604
const ADMIN = process.env.ADMIN || 'hjhj'
const apiURL = `http://127.0.0.1:${TEST_PORT}`
import { Options, Headers } from '../../types/tests'
import fetch, { Response } from 'node-fetch'

const reqHeaders: Headers = {
  authorization: ADMIN,
  'Content-Type': 'application/json'
} 

const mappingAdapter = (
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
  return fetch(`${apiURL}/api/mappings${path}`, options)
}

export { mappingAdapter }
