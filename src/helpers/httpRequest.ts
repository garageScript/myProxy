import fetch from 'node-fetch'

const sendRequest = async <T>(url: string, options: object): Promise<T> => {
  const response = await fetch(url, options)
  const body = await response.text()
  return JSON.parse(body)
}

export { sendRequest }
