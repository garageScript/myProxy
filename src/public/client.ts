/* global helper */

const create: HTMLElement = helper.getElement('.create')
const hostSelector: HTMLElement = helper.getElement('.hostSelector')

let selectedHost = ''

document.querySelectorAll<HTMLElement>('.domainHost').forEach(e => {
  e.onclick = (): void => {
    selectedHost = e.innerText
    hostSelector.innerText = selectedHost
  }
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
  })
}
