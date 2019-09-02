const serviceKeysList = document.querySelector(
  '#serviceHostKeys'
) as HTMLElement

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

/*submit.onclick = (): boolean => {
  if(!serviceKey.value || !serviceValue.value || !service.value) return false
  fetch('/api/admin/serviceHostKeys', {
    method: 'POST',
    body: JSON.stringify({
      key: serviceKey.value,
      value: serviceValue.value,
      service: service.value
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  serviceKey.value = ''
  serviceValue.value = ''
  service.value = ''
  return false
}*/

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
          <div class="enteredKey">
            ${key}
            <input type="text" value=""></input>
          </div>     
        `
      )
    }, '')
    serviceContainer.innerHTML = `
        <h4>${this.service.name}</h4>
        <li class="list-group-item">
          ${serviceKeys}
          <button type="button" class="btn btn-primary">Create</button>
        </li>
      `
    serviceKeysList.appendChild(serviceContainer)
  }
}

const serviceElements = Object.entries(temp).map(([serviceId, serviceInfo]) => {
  return new ServiceElement(serviceId, serviceInfo)
})
