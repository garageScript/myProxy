/* global */
//TODO: Move this function into separate helper function
const getElement = (query: string, root?: HTMLElement): HTMLElement => {
  if (!root) {
    return (
      document.querySelector<HTMLElement>(query)||
      (document.createElement('div') as HTMLElement) 
    )
  }
  return (
    root.querySelector(query)|| (document.createElement('div') as HTMLElement)
  )
}

const create: HTMLElement = getElement('.create')
const hostSelector: HTMLElement = getElement('.hostSelector')
const domainList: HTMLElement = getElement('.domainList') 
const dropDownSubDomains: HTMLElement = getElement('.dropdown-menu')

let selectedHost = ''

fetch('/api/mappings').then(r => r.json()).then((data)=>{
  data.forEach((e, i) => {
    if(e.domain && e.port) {
    const eachSubDomain = document.createElement('div')
    dropDownSubDomains.appendChild(eachSubDomain)
    eachSubDomain.innerHTML = `
      <button class="dropdown-item domainHost">${e.domain}</button>
    `
    }
document.querySelectorAll<HTMLElement>('.domainHost').forEach((e)=>{
  e.onclick = (): void => {
    selectedHost = e.innerText
    hostSelector.innerText = selectedHost
  }
})
  })
})



create.onclick = (): void => {
  const subDomain = getElement('.subDomain') as HTMLInputElement
  const port = getElement('.port') as HTMLInputElement
  const ipAddress = getElement('.ipAddress') as HTMLInputElement

  const portValue = port.value
  const domain = 'https://' + subDomain.value + "/" + selectedHost + ".com"
  const ipValue = ipAddress.value

  fetch('/api/mappings', {
    method: 'POST',
    body: JSON.stringify({
      'domain': domain,
      'port' : portValue,
      'ip' : ipValue
    }),
    headers : {
      'Content-Type' : 'application/json'
    }
  })

  fetch('/api/mappings').then( r => r.json()).then((data) => {
      domainList.innerHTML = ''
    data.forEach((e) => {
      if( e.domain && e.port) {
      const eachDomain = document.createElement('div')
      domainList.appendChild(eachDomain)
      eachDomain.innerHTML = `
        <li class="list-group-item" style="display: flex;">
        <a href="">${e.domain}</a>
        <small class="form-text text-muted" style="display: inline-block;">PORT: ${e.port}</small>
        <hr />
        <hr/>
        <div class="deleteButton" href="">Delete</div>
        </li>
      `
      }
    })
  })


}
