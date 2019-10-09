type Options = {
  headers: unknown
  method: string
  body?: string
}

type Headers = {
  authorization: string
  'Content-Type': string
}

export { Options, Headers }
