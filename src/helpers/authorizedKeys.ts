import fs from 'fs'
import os from 'os'
const userHomeDirectory = os.homedir()

let authorizedKeys: { [key: string]: string } = {}

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

const addAuthorizedKey = (id: string, key: string): void => {
  authorizedKeys[id] = key
  updateSSHKey()
}

const removeAuthorizedKey = (id: string): void => {
  delete authorizedKeys[id]
  updateSSHKey()
}

const setAuthorizedKeys = (keys: { [key: string]: string }): void => {
  authorizedKeys = keys
}

export {
  addAuthorizedKey,
  authorizedKeys,
  removeAuthorizedKey,
  setAuthorizedKeys
}
