import fetch from 'node-fetch'

export default async (url: string, options: object) => {
  try {
    const request = await fetch(url, options)
    return await request.json()
  } catch (error) {
    throw new Error(error)
  }
}
