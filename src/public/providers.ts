/* global */
const getElement = (query: string, root?: HTMLElement): HTMLElement => {
  // TSHelp: Hack. Should really be using default variables
  if (!root) {
    console.log('getting data', query)
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
console.log('providerList', providerList)

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

class ProviderElement {
  providerId: string
  provider: Provider
  constructor(providerId: string, provider: Provider) {
    this.provider = provider
    this.providerId = providerId
    const providerContainer = document.createElement('div')
    const providerKeys = this.provider.keys.reduce(
      (acc: string, key: string) => {
        return (
          acc +
          `
          <div class="providerContainer">
            <span class="serviceKeyName">${key}</span>
            <input type="text" value="" class="keyInput"></input>
          </div>     
        `
        )
      },
      ''
    )
    providerContainer.innerHTML = `
        <h4>${this.provider.name}</h4>
        <li class="list-group-item">
          ${providerKeys}
          <button type="button" class="btn btn-primary createOrEditKeysButton">Create</button>
        </li>
      `
    const submitKeys = getElement('.createOrEditKeysButton')
    submitKeys.onclick = (): void => {
      const keyNames = providerContainer.querySelectorAll<HTMLElement>(
        '.serviceKeyName'
      )
      const keyInputs = providerContainer.querySelectorAll<HTMLInputElement>(
        '.keyInput'
      )
      keyInputs.forEach((providerKey, index) => {
        const keyName = keyNames[index].innerText
        fetch('/api/admin/providerKeys', {
          method: 'POST',
          body: JSON.stringify({
            key: keyName,
            value: providerKey.value,
            service: provider.name
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      })
    }
    providerList.appendChild(providerContainer)
  }
}

Object.entries(temp).forEach(([providerId, providerInfo]) => {
  return new ProviderElement(providerId, providerInfo)
})
