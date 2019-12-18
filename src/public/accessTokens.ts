/* global helper */

type AccessToken = {
  name: string
  id: string
}

const submit: HTMLElement = helper.getElement('.createToken')
const tokensList: HTMLElement = helper.getElement('.tokensList')

class AccessTokens {
  constructor(data: AccessToken) {
    const token = document.createElement('li')
    token.classList.add('list-group-item', 'd-flex', 'align-items-center')
    tokensList.appendChild(token)
    token.innerHTML = `
     <div style="width: 100%">
      <div style="diplay: flex;>
        <a class="font-weight-bold">
        Token Name: ${data.name}
        </a>
        <small class="form-text text-muted ml-1">
        Token ID: ${data.id}
        </small>
      </div>
     </div>
     <button 
      class="btn btn-sm btn-outline-danger mr-3 deleteButton"
      type="button"
     >
      Delete
     </button>
    `
    const delButton = helper.getElement('.deleteButton', token)
    delButton.onclick = (): void => {
      if (confirm('Are you sure you want to delete this token?')) {
        fetch(`/api/accessTokens/${data.id}`, {
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
  }
}

fetch('/api/accessTokens')
  .then(r => r.json())
  .then(tokens => {
    tokensList.innerHTML = ''
    tokens.reverse()
    tokens.forEach(e => new AccessTokens(e))
  })

submit.onclick = (): void => {
  const tokenName = helper.getElement('.inputBox') as HTMLInputElement
  fetch('/api/accessTokens', {
    method: 'POST',
    body: JSON.stringify({
      name: tokenName.value
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(() => {
    window.location.reload()
  })
}
