import fs from 'fs'
import os from 'os'
const userHomeDirectory = os.homedir()

let authorizedKeys: Array<string> = []

const updateSSHKey = (): void => {
  const file = fs.createWriteStream(`${userHomeDirectory}/.ssh/authorized_keys`)
  file.on('error', err => {
    console.log(err)
  })
  Object.values(authorizedKeys).forEach(v => {
    file.write(`${v}\n`)
  })
  file.end()
}

const addAuthorizedKey = (key: string): void => {
  authorizedKeys.push(key)
  updateSSHKey()
}

const removeAuthorizedKey = (id: string): void => {
  delete authorizedKeys[id]
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
