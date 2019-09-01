import fetch from 'node-fetch'

const sendRequest = async <T>(url: string, options: object): Promise<T> => {
  try {
    const request = await fetch(url, options)
    return await request.json()
  } catch (error) {
    throw new Error(error)
  }
}

export { sendRequest }
