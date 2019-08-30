const serviceKey = document.querySelector('#serviceKey') as HTMLInputElement
const serviceValue = document.querySelector('#value') as HTMLInputElement
const service = document.querySelector('#service') as HTMLInputElement
const submit = document.querySelector('#newService') as HTMLElement
submit.onclick = (): boolean => {
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
  return false
}
