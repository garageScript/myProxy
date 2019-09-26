/* global helper */
type Mapping = {
  domain: string
  subDomain: string
  ip: string
  port: string
  id: string
  gitLink: string
  fullDomain: string
}

const create: HTMLElement = helper.getElement('.create')
const hostSelector: HTMLElement = helper.getElement('#hostSelector')
const domainList: HTMLElement = helper.getElement('.domainList')
const dropDownDomains: HTMLElement = helper.getElement('.dropdown-menu')
let selectedHost = ''

// eslint-disable-next-line
class DomainOption {
  constructor(domain: string) {
    const dropdownElement = document.createElement('button')
    dropdownElement.classList.add('dropdown-item')
    dropdownElement.textContent = domain
    dropdownElement.onclick = (): void => {
      hostSelector.innerText = domain
      selectedHost = domain
    }

    dropDownDomains.appendChild(dropdownElement)
  }
}

class MappingItem {
  constructor(data: Mapping) {
    const mappingElement = document.createElement('li')
    mappingElement.classList.add(
      'list-group-item',
      'd-flex',
      'align-items-center'
    )
    domainList.appendChild(mappingElement)
    mappingElement.innerHTML = `
      <div style='width: 100%'>
        <div style='display: flex'>
          <a href="">${data.subDomain}.${data.domain}</a>
          <small
            class="form-text text-muted ml-1" style="display: inline-block;"
          >
            PORT: ${data.port}
          </small>
        </div>
        <small class="form-text text-muted" style="display: inline-block;">
          ${data.gitLink}
        </small>
      </div>
      <button
        class="btn btn-sm btn-outline-danger mr-3 deleteButton"
        type="button">
          Delete
      </button>
      <button class="btn btn-sm btn-outline-primary edit" type="button">
        Edit
      </button>
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
    data = [
      {
        subDomain: 'subDomain',
        domain: 'domain',
        port: '3002',
        id: '12345',
        ip: '128.0.0.1',
        gitLink: 'git@hireme.fun:/home/git/david.hireme.fun',
        fullDomain: 'fullDomain'
      },
      {
        subDomain: 'subDomain',
        domain: 'domain',
        port: '3002',
        id: '12345',
        ip: '128.0.0.1',
        gitLink: 'git@hireme.fun:/home/git/david.hireme.fun',
        fullDomain: 'fullDomain'
      }
    ]
    data.reverse()
    data
      .filter(
        e =>
          e.subDomain &&
          e.domain &&
          e.port &&
          e.id &&
          e.ip &&
          e.gitLink &&
          e.fullDomain
      )
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
    if (res.status === 400)
      return alert('Port Value cannot be smaller than 3001')
    window.location.reload()
  })
  port.value = ''
  ipAddress.value = ''
  subDomain.value = ''
}

fetch('/api/availableDomains')
  .then(r => r.json())
  .then((data: Mapping[]) => {
    const domains = data.map(el => el.domain).sort()
    domains.forEach(domain => new DomainOption(domain))
    selectedHost = domains[0]
    hostSelector.innerText = domains[0]
  })
