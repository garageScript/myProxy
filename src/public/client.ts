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
      //TODO: turn into input boxes for ability to edit.
      editButton.onclick = (): void => {
        mappingElement.innerHTML = `
        <li class='list-group-item'>
         Domain: <input class='domain'type="" value='${data.domain}'>
         Port:  <input class='port'type="" value=${data.port}>
         IP:  <input class='ip' type="" value=${data.ip}>
         <div class ='saveButtonContainer' style="display: flex;">
         <hr />
         <button  class='btn btn-primary mb-2 save'>SAVE</button>
         </div>
         </li>
        `

        const save = helper.getElement('.save', mappingElement)
        save.onclick = (): void => {
          const domain = helper.getElement(
            '.domain',
            mappingElement
          ) as HTMLInputElement
          const port = helper.getElement(
            '.port',
            mappingElement
          ) as HTMLInputElement
          const ip = helper.getElement(
            '.ip',
            mappingElement
          ) as HTMLInputElement

          const domainValue = domain.value
          const portValue = port.value
          const ipValue = ip.value
          const id = data.id
          console.log(domainValue, portValue, ipValue)
          fetch(`/api/mappings/edit/${data.id}`, {
            method: 'PATCH',
            body: JSON.stringify({
              domain: domainValue,
              port: portValue,
              ip: ipValue,
              id: id
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(()=>{
            window.location.reload()
          })
        }
      }
    }
  }
}

fetch('/api/mappings')
  .then(r => r.json())
  .then((data: Array<Mapping>) => {
    domainList.innerHTML = ''
    data.reverse()
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

  fetch('/api/mappings', {
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
  port.value = ''
  ipAddress.value = ''
  subDomain.value = ''
}
