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
  service?: string
  value?: string
  key: string
}

class DomainElement {
  // eslint-disable-next-line
  constructor(domainObj: any, domainService: string, container: HTMLElement) {
    const domainElement = document.createElement('div')
    domainElement.innerHTML = `
      <span class="domainElement">${domainObj.domain}</span>
      <button type="button" class="btn btn-primary setUpButton">Setup</button>
    `
    const setUpButton = helper.getElement('.setUpButton', domainElement)
    setUpButton.onclick = (): void => {
      fetch('api/admin/sslCerts', {
        method: 'POST',
        body: JSON.stringify({
          service: domainService,
          selectedDomain: domainObj.domain
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(() => {
          window.location.reload()
        })
    }
    container.appendChild(domainElement)
  }
}

class ProviderKeyElement {
  constructor(
    providerKey: ProviderKey,
    providerId: string,
    providerKeysContainer: HTMLElement
  ) {
    const providerKeyElement = document.createElement('div')
    const isNew = !providerKey.id
    const buttonText = isNew ? 'Create' : 'Update'
    providerKeyElement.innerHTML = `
      <span class="providerKeyName">${providerKey.key}</span>
      <input type="text" value="${providerKey.value ||
        ''}" class="keyInput"></input>
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
          service: providerId
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
      return new ProviderKeyElement(
        providerKey,
        providerId,
        providerKeysContainer
      )
    })
    provider.domains.map(domain => {
      return new DomainElement(domain, providerId, domainListContainer)
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
