/* global */
const providerList: HTMLElement = helper.getElement('.providerList')

type Provider = {
  id?: string
  name: string
  service: string
  keys: Array<ProviderKey>
}

type ProviderKey = {
  id?: string
  service?: string
  value?: string
  key: string
}

class ProviderKeyElement {
  constructor(providerKey: ProviderKey, providerKeysContainer: HTMLElement) {
    const providerKeyElement = document.createElement('div')
    const isNew = !providerKey.id
    const buttonText = isNew ? 'Create' : 'Update'
    providerKeyElement.innerHTML = `
      <span class="providerKeyName">${providerKey.key}</span>
      <input type="text" value="${providerKey.value || ''}" class="keyInput"></input>
      <button type="button" class="btn btn-primary createOrUpdateButton">${buttonText}</button>      
    `
    const createOrUpdate = helper.getElement(
      '.createOrUpdateButton',
      providerKeyElement
    )
    createOrUpdate.onclick = (): void => {
      const keyInput = helper.getElement(
        '.keyInput',
        providerKeyElement
      ) as HTMLInputElement
      const method = isNew ? 'POST' : 'PATCH'
      fetch(`/api/admin/providerKeys/${providerKey.id || ''}`, {
        method,
        body: JSON.stringify({
          key: providerKey.key,
          value: keyInput.value,
          service: providerKey.service
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
  constructor(providerId: string, provider: Provider) {
    const providerContainer = document.createElement('div')
    providerContainer.innerHTML = `
        <h4>${provider.name}</h4>
        <li class="list-group-item providerKeysContainer"></li>
      `
    const providerKeysContainer = helper.getElement(
      '.providerKeysContainer',
      providerContainer
    )
    provider.keys.map((providerKey: ProviderKey) => {
      return new ProviderKeyElement(providerKey, providerKeysContainer)
    })
    providerList.appendChild(providerContainer)
  }
}

fetch('/api/admin/providers')
  .then(res => res.json())
  .then(providerList => {
    providerList.map((provider: Provider) => {
      const providerId = provider.id || ''
      return new ProviderElement(providerId, provider)
    })
  })
