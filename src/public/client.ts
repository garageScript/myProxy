/* global helper */
type Mapping = {
  domain: string
  ip: string
  port: string
  id: string
}

const create: HTMLElement = helper.getElement('.create')
const hostSelector: HTMLElement = helper.getElement('.hostSelector')
const domainList: HTMLElement = helper.getElement('.domainList')
const dropDownDomains: HTMLElement = helper.getElement('.dropdown-menu')
let selectedHost = ''

class DomainMap {
  constructor(data: Mapping) {
    if (data.domain) {
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
}

class DisplayMap {
  constructor(data: Mapping) {
    if (data.domain && data.port) {
      const mappingElement = document.createElement('div')
      domainList.appendChild(mappingElement)
      mappingElement.innerHTML = `
    <li class="list-group-item" style="display: flex;">
    <a href="">${data.domain}</a>
        <small class="form-text text-muted" style="display: inline-block;">PORT: ${data.port}</small>
        <hr />
        <div class="deleteButton" href="/">Delete</div>
    </li>
`
    }
  }
}

fetch('/api/mappings')
  .then(r => r.json())
  .then((data: Array<Mapping>) => {
    domainList.innerHTML = ''
    data.forEach(e => {
      new DisplayMap(e)
    })
  })

create.onclick = (): void => {
  const subDomain = helper.getElement('.subDomain') as HTMLInputElement
  const port = helper.getElement('.port') as HTMLInputElement
  const ipAddress = helper.getElement('.ipAddress') as HTMLInputElement

  const portValue = port.value
  const domain = subDomain.value + selectedHost
  const ipValue = ipAddress.value

  fetch('/', {
    method: 'POST',
    body: JSON.stringify({
      domain: domain,
      port: portValue,
      ip: ipValue
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(() => {
    window.location.reload()
  })

  fetch('/')
    .then(r => r.json())
    .then((data: Array<Mapping>) => {
      domainList.innerHTML = ''
      data.forEach(e => {
        if (e.domain && e.port) {
          const eachDomain = document.createElement('div')
          domainList.appendChild(eachDomain)
          eachDomain.innerHTML = `
        <li class="list-group-item" style="display: flex;">
        <a href="">${e.domain}</a>
        <small class="form-text text-muted" style="display: inline-block;">PORT: ${e.port}</small>
        <hr />
        <hr/>
        <div class="deleteButton" href="/">Delete</div>
        </li>
      `
        }
        document
          .querySelectorAll<HTMLElement>('.deleteButton')
          .forEach(delButton => {
            delButton.onclick = (): void => {
              console.log('delete works')
              fetch(`/delete/${e.id}`, {
                method: 'DELETE',
                body: JSON.stringify({ e }),
                headers: {
                  'Content-Type': 'application/json'
                }
              })
            }
          })
      })
    })
}
