import fs from 'fs'
import environment from '../helpers/environment'

const { isProduction } = environment
let authorizedKeys: Array<string> = []

const updateSSHKey = (): void => {
  if (isProduction()) {
    const file = fs.createWriteStream('/home/myproxy/.ssh/authorized_keys')
    file.on('error', err => {
      console.log(err)
    })
    authorizedKeys.forEach(v => {
      file.write(`${v}\n`)
    })
    file.end()
  }
}

const addAuthorizedKey = (key: string): void => {
  authorizedKeys.push(key)
  updateSSHKey()
}

const removeAuthorizedKey = (id: number): void => {
  authorizedKeys.splice(id, 1)
  updateSSHKey()
}

const setAuthorizedKeys = (keys: Array<string>): void => {
  authorizedKeys = keys
}

export {
  addAuthorizedKey,
  authorizedKeys,
  removeAuthorizedKey,
  setAuthorizedKeys
}
