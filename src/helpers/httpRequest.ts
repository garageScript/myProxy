import fetch from 'node-fetch'

const sendRequest = async <T>(url: string, options: object): Promise<T> => {
  const response = await fetch(url, options)
  return await response.json()
}

export { sendRequest }
