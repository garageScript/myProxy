const serviceKey = document.querySelector('#serviceKey') as HTMLInputElement
const serviceValue = document.querySelector('#value') as HTMLInputElement
const service = document.querySelector('#service') as HTMLInputElement
const submit = document.querySelector('#newService') as HTMLElement
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
serviceKeysList.innerHTML = Object.values(temp).reduce(
  (acc, service) => {
    const keyInputs = service.keys.reduce((acc, key) => {
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
    return (
      acc +
      `
    <h4>${service.name}</h4>
    <li class="list-group-item">
      ${keyInputs}
      <button type="button" class="btn btn-primary">Create</button>
    </li>
  `
    )
  },
  ''
)
