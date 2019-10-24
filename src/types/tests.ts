type Headers = {
  authorization: string
  'Content-Type': string
}

type Options = {
  headers: Headers
  method: string
  body?: string
}

export { Options, Headers }
