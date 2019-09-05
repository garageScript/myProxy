/* global */
const getElement = (query: string, root?: HTMLElement): HTMLElement => {
  // TSHelp: Hack. Should really be using default variables
  if (!root) {
    return (
      document.querySelector<HTMLElement>(query) ||
      (document.createElement('div') as HTMLElement)
    )
  }
  return (
    root.querySelector(query) || (document.createElement('div') as HTMLElement)
  )
}

const providerList: HTMLElement = getElement('.providerList')

type Provider = {
  id?: string
  name: string
  service: string
  keys: string[]
}

class ProviderKey {
  providerKey: string
  providerKeyValue: string
  providerKeysContainer: HTMLElement
  constructor(
    providerKey: string,
    providerKeyValue: string,
    providerName: string,
    providerKeysContainer: HTMLElement
  ) {
    this.providerKey = providerKey
    this.providerKeysContainer = providerKeysContainer
    this.providerKeyValue = providerKeyValue
    const providerKeyElement = document.createElement('div')
    providerKeyElement.innerHTML = `
      <span class="providerKeyName">${this.providerKey}</span>
      <input type="text" value="${this.providerKeyValue}" class="keyInput"></input>
      <button type="button" class="btn btn-primary saveOrEditKeysButton">Save</button>      
    `
    const saveOrEdit = getElement('.saveOrEditKeysButton', providerKeyElement)
    saveOrEdit.onclick = (): void => {
      const keyName = getElement('.providerKeyName', providerKeyElement)
      const keyInput = getElement(
        '.keyInput',
        providerKeyElement
      ) as HTMLInputElement
      fetch('/api/admin/providerKeys', {
        method: 'PATCH',
        body: JSON.stringify({
          key: keyName.innerText,
          value: keyInput.value,
          service: providerName
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
    providerKeysContainer.appendChild(providerKeyElement)
  }
}

class ProviderElement {
  providerId: string
  provider: Provider
  constructor(providerId: string, provider: Provider) {
    this.provider = provider
    this.providerId = providerId
    const providerContainer = document.createElement('div')
    const providerKeys = this.provider.keys
    providerContainer.innerHTML = `
        <h4>${this.provider.name}</h4>
        <li class="list-group-item providerKeysContainer"></li>
      `
    const providerKeysContainer = getElement(
      '.providerKeysContainer',
      providerContainer
    )
    Object.entries(providerKeys).map(([key, value]) => {
      return new ProviderKey(key, value, provider.name, providerKeysContainer)
    })
    providerList.appendChild(providerContainer)
  }
}

fetch('/api/providers')
  .then(res => res.json())
  .then(providerList => {
    providerList.forEach((provider: Provider) => {
      const providerId = provider.id || ''
      return new ProviderElement(providerId, provider)
    })
  })
