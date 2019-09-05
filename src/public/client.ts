/* global */
//TODO: Move this function into separate helper function
const getElement = (query: string, root?: HTMLElement): HTMLElement => {
  if (!root) {
    return (
      document.querySelector<HTMLElement>(query) ||
      (document.createElement('div') as HTMLElement)
    )
  }
  return (
    root.querySelector(query) || (document.createElement('div') as HTMLElement)
  )
}

const create: HTMLElement = getElement('.create')
const hostSelector: HTMLElement = getElement('.hostSelector')

let selectedHost = ''

document.querySelectorAll<HTMLElement>('.domainHost').forEach(e => {
  e.onclick = (): void => {
    selectedHost = e.innerText
    hostSelector.innerText = selectedHost
  }
})

create.onclick = (): void => {
  const subDomain = getElement('.subDomain') as HTMLInputElement
  const port = getElement('.port') as HTMLInputElement
  const ipAddress = getElement('.ipAddress') as HTMLInputElement

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
