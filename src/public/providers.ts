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
  api: string
  keys: string[]
}

/* HardCoded dns object to display mock UI */
const temp = {
  dnsGd: {
    name: 'GoDaddy',
    api: 'https://api.godaddy.com',
    keys: ['GD_Key', 'GD_Secret']
  },
  dnsPdns: {
    name: 'PowerDNS',
    api: 'https://api.powerdns.com',
    keys: ['PDNS_Url', 'PDNS_ServerId', 'PDNS_Token', 'PDNS_Ttl']
  }
}

class ProviderKey {
  providerKey: string
  providerKeysContainer: HTMLElement
  constructor(providerKey: string, providerName: string, providerKeysContainer: HTMLElement) {
    this.providerKey = providerKey
    this.providerKeysContainer = providerKeysContainer
    const providerKeyElement = document.createElement('div')
    providerKeyElement.innerHTML = `
      <span class="providerKeyName">${this.providerKey}</span>
      <input type="text" value="" class="keyInput"></input>
      <button type="button" class="btn btn-primary saveOrEditKeysButton">Save</button>      
    `
    const saveOrEdit = getElement('.saveOrEditKeysButton', providerKeyElement)
    saveOrEdit.onclick = (): void => {
      const keyName = getElement('.providerKeyName', providerKeyElement)
      const keyInput = getElement('.keyInput', providerKeyElement) as HTMLInputElement
      fetch('/api/admin/providerKeys', {
        method: 'POST',
        body: JSON.stringify({
          key: keyName.innerText,
          value: keyInput.value,
          service: providerName
        }),
        headers: {
          'Content-Type' : 'application/json'
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
    providerContainer.innerHTML = `
        <h4>${this.provider.name}</h4>
        <li class="list-group-item providerKeysContainer"></li>
      `
    const providerKeysContainer = getElement('.providerKeysContainer', providerContainer)
    this.provider.keys.map((key: string) => {
      return new ProviderKey(key, provider.name, providerKeysContainer)
    })
    providerList.appendChild(providerContainer)
  }
}


Object.entries(temp).forEach(([providerId, providerInfo]) => {
  return new ProviderElement(providerId, providerInfo)
})
