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

type Status = {
  fullDomain: string
  status: string
}

type StatusMap = {
  [key: string]: string
}

type FullDomainStatusMap = {
  domain: string
  subDomain: string
  ip: string
  port: string
  id: string
  gitLink: string
  fullDomain: string
  status: string
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
  constructor(data: FullDomainStatusMap) {
    const mappingElement = document.createElement('li')
    let iconClass
    let iconColor
    if (data.status === 'online') {
      iconClass = 'fa fa-check-circle ml-1 mt-1'
      iconColor = 'green'
    } else if (data.status === 'not started') {
      iconClass = ''
      iconColor = 'transparent'
    } else {
      iconClass = 'fa fa-times-circle ml-1 mt-1'
      iconColor = 'red'
    }
    mappingElement.classList.add(
      'list-group-item',
      'd-flex',
      'align-items-center'
    )
    domainList.appendChild(mappingElement)
    mappingElement.innerHTML = `
      <div style='width: 100%'>
        <div style='display: flex'>
          <a class="font-weight-bold"
            href="https://${data.fullDomain}">
            ${data.fullDomain}
          </a>
          <small class="form-text text-muted ml-1">
            PORT: ${data.port}
          </small>
          <i class="${iconClass}" style="color: ${iconColor}"></i>
        </div>
        <small class="form-text text-muted" style="display: inline-block;">
          ${data.gitLink}
        </small>
      </div>
      <a href="/api/mappings/download/?fullDomain=${data.fullDomain}"
	      target="_blank" class="btn btn-sm btn-outline-success mr-3">
	      Download<i class="fa fa-download"></i>
      </a>
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
        <div class="col d-flex">
          <div class="col">
            <div class="input-group m-1">
              <div class="input-group-prepend">
                <span class="input-group-text">Subdomain</span>
              </div>
              <input type="text" class="form-control subDomainName" placeholder=${data.subDomain} disabled>
            </div>
            <div class="input-group m-1">
              <div class="input-group-prepend">
                <span class="input-group-text">Domain</span>
              </div>
              <input type="text" class="form-control domainName" placeholder=${data.domain} disabled>
            </div>
          </div>

          <div class="col">
            <div class="input-group m-1">
              <div class="input-group-prepend">
                <span class="input-group-text">Port Number</span>
              </div>
              <input type="text" class="form-control port" placeholder=${data.port}>
            </div>
            <div class="input-group m-1">
              <div class="input-group-prepend">
                <span class="input-group-text">IP Adress</span>
              </div>
              <input type="text" class="form-control ip" placeholder=${data.ip}>
            </div>
          </div>
          </div>
          <div class="btn-group-vertical">
            <button class="btn btn-outline-primary save">Save</button>
            <button class="btn btn-outline-danger cancel">Cancel</button>
          </div>
        `

      const cancel = helper.getElement('.cancel', mappingElement)
      cancel.onclick = (): void => {
        window.location.reload()
      }

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

Promise.all([
  fetch('/api/mappings').then(r => r.json()),
  fetch('/api/statuses').then(r => r.json())
]).then(([mappings, statuses]: [Mapping[], Status[]]) => {
  const fullDomainStatusMap = mappings.reduce((totalMap, dom) => {
    if (!statuses[dom.fullDomain]) {
      return [...totalMap, { ...dom, status: 'not started' }]
    }

    return [
      ...totalMap,
      {
        ...dom,
        status: statuses[dom.fullDomain]
      }
    ]
  }, [])

  domainList.innerHTML = ''
  fullDomainStatusMap.reverse()
  fullDomainStatusMap
    .filter(e => e.domain && e.port && e.id && e.gitLink && e.fullDomain)
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
    if (res.status === 400) {
      return res.json().then(response => {
        alert(response.message)
      })
    }
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
