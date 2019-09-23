/* global helper */
type Mapping = {
  domain: string
  subDomain: string
  ip: string
  port: string
  id: string
}

const create: HTMLElement = helper.getElement('.create')
const hostSelector: HTMLElement = helper.getElement('.hostSelector')
const domainList: HTMLElement = helper.getElement('.domainList')
const dropDownDomains: HTMLElement = helper.getElement('.dropdown-menu')
let selectedHost = ''

// eslint-disable-next-line
class DomainOption {
  constructor(data: Mapping) {
    const dropdownElement = document.createElement('div')
    dropDownDomains.appendChild(dropdownElement)
    dropdownElement.innerHTML = `
    <li class="list-group-item" style="display: flex;">
    ${data.domain}
    </li>
    `
    dropdownElement.onclick = (): void => {
      hostSelector.innerText = data.domain
      selectedHost = data.domain
    }
  }
}

class MappingItem {
  constructor(data: Mapping) {
    const mappingElement = document.createElement('div')
    domainList.appendChild(mappingElement)
    mappingElement.innerHTML = `
    <li class="list-group-item" style="display: flex;">
    <a href="">${data.subDomain}.${data.domain}</a>
        <small class="form-text text-muted" style="display: inline-block;">PORT:${
  data.port
}</small>
        <hr />
        <div class="deleteButton" href="/">Delete</div>
        <div class="edit" href="/" style="padding: 0px 0px 0px 20px;">Edit</div>
    </li>
`

    const delButton = helper.getElement('.deleteButton', mappingElement)
    delButton.onclick = (): void => {
      if (confirm('Are you sure want to delete this domain?')) {
        fetch(`/api/mappings/delete/${data.id}`, {
          method: 'DELETE',
          body: JSON.stringify({ data }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(() => {
          window.location.reload()
        })
      }
    }
    const editButton = helper.getElement('.edit', mappingElement)
    editButton.onclick = (): void => {
      mappingElement.innerHTML = `
        <li class='list-group-item'>
          <div class="form-row">
            <div class="col">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                 <span class="input-group-text">Domain</span>
                </div>
                <input type="text" class="form-control domainName" placeholder=${data.domain}>
              </div>
            </div>
            <div class="col">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                 <span class="input-group-text">Subdomain</span>
                </div>
                <input type="text" class="form-control subDomainName" placeholder=${data.subDomain}>
              </div>
            </div>
            <div class="col">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                 <span class="input-group-text">Port</span>
                </div>
                <input type="text" class="form-control port" placeholder=${data.port}>
              </div>
            </div>
            <div class="col">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                 <span class="input-group-text">IP</span>
                </div>
                <input type="text" class="form-control ip" placeholder=${data.ip}>
              </div>
            </div>
            <div class="col">
              <button class="btn btn-primary mb-2 save" style="margin-left: 180px;">Save</button>
            </div>
          </div>
        </li>
        `

      const save = helper.getElement('.save', mappingElement)
      save.onclick = (): void => {
        const domainName = helper.getElement(
          '.domain',
          mappingElement
        ) as HTMLInputElement
        const subDomainName = helper.getElement(
          '.subDomainName',
          mappingElement
        ) as HTMLInputElement
        const port = helper.getElement(
          '.port',
          mappingElement
        ) as HTMLInputElement
        const ip = helper.getElement('.ip', mappingElement) as HTMLInputElement

        const domainNameValue = domainName.value
        const subDomainNameValue = subDomainName.value
        const portValue = port.value
        const ipValue = ip.value
        const id = data.id
        fetch(`/api/mappings/edit/${data.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            domain: domainNameValue,
            subDomain: subDomainNameValue,
            port: portValue,
            ip: ipValue,
            id: id
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(() => {
          window.location.reload()
        })
      }
    }
  }
}

fetch('/api/mappings')
  .then(r => r.json())
  .then((data: Mapping[]) => {
    domainList.innerHTML = ''
    data.reverse()
    data
      .filter(e => e.subDomain && e.domain && e.port && e.id && e.ip)
      .forEach(e => {
        new MappingItem(e)
      })
  })

create.onclick = (): void => {
  const subDomain = helper.getElement('.subDomain') as HTMLInputElement
  const port = helper.getElement('.port') as HTMLInputElement
  const ipAddress = helper.getElement('.ipAddress') as HTMLInputElement
  const portValue = port.value
  const domain = selectedHost
  const ipValue = ipAddress.value
  const subDomainValue = subDomain.value

  fetch('/api/mappings', {
    method: 'POST',
    body: JSON.stringify({
      domain: domain,
      subDomain: subDomainValue,
      port: portValue,
      ip: ipValue
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => {
    if (res.status === 400) return alert('Port Value cannot be smaller than 3001')
    window.location.reload()
  })
  port.value = ''
  ipAddress.value = ''
  subDomain.value = ''
}

fetch('/api/availableDomains')
  .then(r => r.json())
  .then((data: Mapping[]) => {
    data.forEach(e => new DomainOption(e))
  })
