import fs from 'fs'
import os from 'os'
const userHomeDirectory = os.homedir()

let authorizedKeys: { [key: string]: string } = {}

const updateSSHKey = (): void => {
  fs.writeFile(
    `${userHomeDirectory}/.ssh/authorized_keys`,
    Object.values(authorizedKeys),
    err => {
      if (err) console.log(err)
    }
  )
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
