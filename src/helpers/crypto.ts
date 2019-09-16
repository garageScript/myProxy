import crypto from 'crypto'

const hashPass = (string: string): string => {
  return crypto
    .createHash('sha256')
    .update(string)
    .digest('hex')
}

export { hashPass }
