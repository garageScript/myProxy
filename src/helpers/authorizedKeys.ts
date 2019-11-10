import fs from 'fs'
import os from 'os'
const userHomeDirectory = os.homedir()

let authorizedKeys: Array<string> = []

const updateSSHKey = (): void => {
  const file = fs.createWriteStream(`${userHomeDirectory}/.ssh/authorized_keys`)
  file.on('error', err => {
    console.log(err)
  })
  authorizedKeys.forEach(v => {
    file.write(`${v}\n`)
  })
  file.end()
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
