/* global */
const providerList: HTMLElement = helper.getElement('.providerList')

type Provider = {
  id?: string
  name: string
  service: string
  keys: ProviderKey[]
  domains: Domain[]
}

type ProviderKey = {
  id?: string
  service?: string
  value?: string
  key: string
}

type Domain = {
  domain: string
  expires?: string
  provider?: string
}

class DomainElement {
  constructor(
    domainObj: Domain,
    domainService: string,
    availableDomains: Domain[],
    container: HTMLElement
  ) {
    const domainElement = document.createElement('li')
    domainElement.classList.add('list-group-item')
    const foundDomain = availableDomains.find(
      e => e.domain === domainObj.domain
    )
    const checkDomain = foundDomain
      ? '<i class="fa fa-check-circle" style="color:green"></i>'
      : ''
    const isSetup = foundDomain ? 'Reconfigure' : 'Setup'
    const setUpButtonClass =
      isSetup === 'Reconfigure' ? 'btn-outline-danger' : 'btn-outline-primary'
    domainElement.innerHTML = `
      <div class="
        actionContainer d-flex
        align-items-center
        justify-content-between"
      >
        <div>${domainObj.domain} ${checkDomain}</div>
        <div class="
          actionContainer
          alert alert-warning
          m-0 p-1 loading"
          role="alert"
        >
          Please wait, this might take up to 3-4 minutes...
        </div>
        <button type="button" class="btn ${setUpButtonClass} setUpButton">
          ${isSetup}
        </button>
        <button class="btn btn-primary loading" type="button" disabled>
          <i class="fa fa-spinner fa-spin"></i>
          Loading...
        </button>
      </div>
    `
    const actionContainer: HTMLElement = helper.getElement(
      '.actionContainer',
      domainElement
    )
    const setUpButton = helper.getElement('.setUpButton', domainElement)
    const method = foundDomain ? 'PATCH' : 'POST'
    const selectedDomain = foundDomain ? domainObj.domain : ''
    setUpButton.onclick = (): void => {
      actionContainer.classList.add('isLoading')
      fetch(`/api/admin/sslCerts/${selectedDomain}`, {
        method,
        body: JSON.stringify({
          service: domainService,
          selectedDomain: domainObj.domain
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          return res.json()
        })
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
      <div class="input-group">
        <div class="input-group-prepend">
          <span
            class="input-group-text"
            id="inputGroup-sizing-default">
              ${providerKey.key.replace('_', ' ')}
          </span>
        </div>
        <input
          type="password"
          class="form-control keyInput"
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          value="${providerKey.value || ''}"
        >
        <div class="input-group-append">
          <button
            class="btn btn-outline-primary createOrUpdateButton"
            type="button">
              ${buttonText}
          </button>
        </div>
      </div>
    `
    providerKeyElement.className = 'list-group-item'
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
      // return console.log('click', providerKey, method)
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
      }).then(() => window.location.reload())
    }
    providerKeysContainer.appendChild(providerKeyElement)
  }
}

class ProviderElement {
  constructor(providerId: string, provider: Provider) {
    const providerContainer = document.createElement('li')
    providerContainer.classList.add('list-group-item')
    providerContainer.innerHTML = `
        <h3>${provider.name}</h3>
        <div class="list-group-item">
          <div class="providerKeysContainer"></div>
          <hr />
          <h4>Domains</h4>
          <ul class="domainList list-group"></ul>
        </div>
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
    fetch('/api/availableDomains')
      .then(res => res.json())
      .then(availableDomains => {
        provider.domains.map(domain => {
          return new DomainElement(
            domain,
            providerId,
            availableDomains,
            domainListContainer
          )
        })
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
