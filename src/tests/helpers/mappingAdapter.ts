const TEST_PORT = process.env.PORT || 50604
const ADMIN = process.env.ADMIN || 'hjhj'
const apiURL = `http://127.0.0.1:${TEST_PORT}`
import fetch from 'node-fetch'
import { Options, Headers } from '../../types/tests'

const requestHeaders: Headers = {
  authorization: ADMIN,
  'Content-Type': 'application/json',
}

const mappingAdapter = (path = '/', method: string, body?: object) => {
  const options: Options = {
    method,
    headers: requestHeaders,
  }
  if (body) {
    options.body = JSON.stringify(body)
  }
  return fetch(`${apiURL}/api/mappings${path}`, options)
}

export { mappingAdapter }
