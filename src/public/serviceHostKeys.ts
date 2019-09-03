const serviceKeysList = document.querySelector<HTMLElement>('#serviceHostKeys')

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

class ServiceElement {
  service: Provider
  serviceId: string
  constructor(serviceId: string, service: Provider) {
    this.service = service
    this.serviceId = serviceId
    const serviceContainer = document.createElement('div')
    const serviceKeys = this.service.keys.reduce((acc: string, key: string) => {
      return (
        acc +
        `
          <div class="providerContainer">
            <span class="serviceKeyName">${key}</span>
            <input type="text" value="" class="keyInput"></input>
          </div>     
        `
      )
    }, '')
    serviceContainer.innerHTML = `
        <h4>${this.service.name}</h4>
        <li class="list-group-item">
          ${serviceKeys}
          <button type="button" class="btn btn-primary createOrEditKeysButton">Create</button>
        </li>
      `
    const submitKeys = serviceContainer.querySelector<HTMLElement>(
      '.createOrEditKeysButton'
    )
    submitKeys.onclick = (): void => {
      const keyNames = serviceContainer.querySelectorAll<HTMLElement>(
        '.serviceKeyName'
      )
      const keyInputs = serviceContainer.querySelectorAll<HTMLInputElement>(
        '.keyInput'
      )
      keyInputs.forEach((serviceKey, index) => {
        const keyName = keyNames[index].innerText
        fetch('/api/admin/serviceHostKeys', {
          method: 'POST',
          body: JSON.stringify({
            key: keyName,
            value: serviceKey.value,
            service: service.name
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      })
    }
    serviceKeysList.appendChild(serviceContainer)
  }
}

const serviceElements = Object.entries(temp).map(([serviceId, serviceInfo]) => {
  return new ServiceElement(serviceId, serviceInfo)
})
