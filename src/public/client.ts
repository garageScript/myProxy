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
const dropDownDomains = helper.getElement('.dropdown-menu')

class DomainMap {
  constructor(data: Mapping) {
    const mappingElement = document.createElement('div')
    dropDownDomains.appendChild(mappingElement)
    mappingElement.innerHTML = `
    <li class="list-group-item" style="display: flex;">
    <a href="">${data.domain}</a>
    <small class="form-text text-muted" style="display: inline-block;">PORT: ${data.port}</small>
    <hr />
    <hr/>
    <div class="deleteButton" href="">Delete</div>
    </li>
`
  }
}

fetch('/api/mappings')
  .then(r => r.json())
  .then((data: Array<Mapping>) => {
    domainList.innerHTML = ''
    data.forEach(e => new DomainMap(e))
  })

let selectedHost = ''

fetch('/api/mappings')
  .then(r => r.json())
  .then((data: Array<Mapping>) => {
    data.forEach(e => {
      if (e.domain && e.port) {
        const eachSubDomain = document.createElement('div')
        dropDownDomains.appendChild(eachSubDomain)
        eachSubDomain.innerHTML = `
      <button class="dropdown-item domainHost">${e.domain}</button>
    `
      }
      document.querySelectorAll<HTMLElement>('.domainHost').forEach(e => {
        e.onclick = (): void => {
          selectedHost = e.innerText
          hostSelector.innerText = selectedHost
        }
      })
    })
  })

create.onclick = (): void => {
  const subDomain = helper.getElement('.subDomain') as HTMLInputElement
  const port = helper.getElement('.port') as HTMLInputElement
  const ipAddress = helper.getElement('.ipAddress') as HTMLInputElement

  const portValue = port.value
  const domain = 'https://' + subDomain.value + '/' + selectedHost + '.com'
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
