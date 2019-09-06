/* global */
const providerList: HTMLElement = helper.getElement('.providerList')

type Provider = {
  id?: string
  name: string
  service: string
  keys: Array<ProviderKey>
  // eslint-disable-next-line
  domains: Array<any>
}

type ProviderKey = {
  id?: string
  key: string
  service: string
  value: string
}

class DomainElement {
  // eslint-disable-next-line
  constructor(domainObj: any, container: HTMLElement) {
    const domainElement = document.createElement('div')
    domainElement.innerHTML = `
      <span class="domainElement">${domainObj.domain}</span>
      <button type="button" class="btn btn-primary setupButton">Setup</button>
    `
    container.appendChild(domainElement)
  }
}

class ProviderKeyElement {
  constructor(providerKey: ProviderKey, providerKeysContainer: HTMLElement) {
    const providerKeyElement = document.createElement('div')
    providerKeyElement.innerHTML = `
      <span class="providerKeyName">${providerKey.key}</span>
      <input type="text" value="${providerKey.value}" class="keyInput"></input>
      <button type="button" class="btn btn-primary saveOrEditKeysButton">Save</button>      
    `
    const saveOrEdit = helper.getElement(
      '.saveOrEditKeysButton',
      providerKeyElement
    )
    saveOrEdit.onclick = (): void => {
      const keyInput = helper.getElement(
        '.keyInput',
        providerKeyElement
      ) as HTMLInputElement
      fetch(`/api/admin/providerKeys/${providerKey.id}`, {
        method: 'PATCH',
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
        <h3>${provider.name}</h4>
        <li class="list-group-item">
          <div class="providerKeysContainer"></div>
          <hr />
          <h4>Domains</h4>
          <div class="domainList"></div>
        </li>
      `
    const providerKeysContainer = helper.getElement(
      '.providerKeysContainer',
      providerContainer
    )
    const domainListContainer = helper.getElement(
      '.domainList',
      providerContainer
    )
    provider.keys.map((providerKey: ProviderKey) => {
      return new ProviderKeyElement(providerKey, providerKeysContainer)
    })
    provider.domains.map(domain => {
      return new DomainElement(domain, domainListContainer)
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
