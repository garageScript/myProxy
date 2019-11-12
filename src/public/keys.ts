const keyList = document.querySelector('.sshKeysList')
const newKey = document.getElementById('sshKey') as HTMLInputElement
const submitSSHKey = document.getElementById('newSshKey')

const title = document.getElementById('title') as HTMLInputElement

newKey.oninput = (e): void => {
  const { value } = e.target as HTMLInputElement
  title.value = value.split(' ')[2] || ''
}

submitSSHKey.onclick = (): void => {
  fetch('/api/sshKeys', {
    method: 'POST',
    body: JSON.stringify({ key: newKey.value }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(() => {
    window.location.reload()
  })
}

fetch('/api/sshKeys')
  .then(r => r.json())
  .then(data => {
    data.forEach((key, index) => {
      const newKey = document.createElement('Li')
      const removeButton = document.createElement('button')
      removeButton.className = 'btn btn-xs pull-right btn-outline-danger'
      removeButton.innerText = 'Delete'
      removeButton.onclick = (): void => {
        fetch('/api/sshKeys', {
          method: 'DELETE',
          body: JSON.stringify({ id: index }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(() => {
          window.location.reload()
        })
      }
      newKey.className = 'list-group-item'
      newKey.innerHTML = key
      newKey.appendChild(removeButton)
      keyList.appendChild(newKey)
    })
  })
