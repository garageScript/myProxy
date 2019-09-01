const serviceKeysList = document.querySelector(
  '#serviceHostKeys'
) as HTMLElement

/* HardCoded dns object to display mock UI */
const temp = {
  dnsGd: {
    name: 'GoDaddy',
    keys: ['GD_Key', 'GD_Secret']
  },
  dnsPdns: {
    name: 'PowerDNS',
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
  service: any
  constructor(service: any) {
    this.service = service
  }
  createService(): void {
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

Object.values(temp).map(service => {
  const element = new ServiceElement(service)
  element.createService()
  return element
})
