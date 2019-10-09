const TEST_PORT = process.env.PORT || 50604
const ADMIN = process.env.ADMIN || 'hjhj'
const apiURL = `http://127.0.0.1:${TEST_PORT}`
import fetch from 'node-fetch'

type Options = {
  headers: unknown
  method: string
  body?: string
}

const mappingAdapter = (path = '/', method: string, body?: object) => {
  const options: Options = {
    method: method,
    headers: {
      authorization: ADMIN,
      'Content-Type': 'application/json',
    },
  }
  if (body) {
    options.body = JSON.stringify(body)
  }
  return fetch(`${apiURL}/api/mappings${path}`, options)
}

export { mappingAdapter }
