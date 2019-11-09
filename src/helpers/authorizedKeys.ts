let authorizedKeys: { [key: string]: string } = {}

const addAuthorizedKey = (id: string, key: string): void => {
  authorizedKeys[id] = key
}

const removeAuthorizedKey = (id: string): void => {
  delete authorizedKeys[id]
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
