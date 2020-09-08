const envList = helper.getElement('.envList')
const environmentVariables: EnvironmentItem[] = []
const fullDomain = window.location.pathname.split('/').pop()
document.getElementById('full-domain').innerText = fullDomain

class EnvironmentItem {
  name: string
  value: string
  isValid = false

  constructor(name?: string, value?: string) {
    this.name = name
    this.value = value
    const environmentElement = document.createElement('li')
    environmentElement.classList.add(
      'list-group-item',
      'd-flex',
      'align-items-center'
    )
    envList.appendChild(environmentElement)
    environmentElement.innerHTML = `
      <div class="input-group">
        <input 
          type="text"
          aria-label="Name"
          class="form-control text-uppercase text-monospace"
          placeholder="NAME"
          id="name"
        >
        <div class="input-group-prepend input-group-append">
          <span class="input-group-text">=</span>
        </div>
        <input
          type="text"
          aria-label="Value"
          class="form-control text-monospace"
          placeholder="Value"
          id="value"
        >
        <div class="input-group-append">
          <button
            class="btn btn-outline-danger"
            type="button"
            id="removeVariable"
          >
            Remove
          </button>
        </div>
        <div class="invalid-feedback">
          The variable name must contain only letters, number, and/or the underscore character.
        </div>
      </div>
    `

    const nameInputElement = environmentElement.querySelector(
      '#name'
    ) as HTMLInputElement
    const valueInputElement = environmentElement.querySelector(
      '#value'
    ) as HTMLInputElement
    nameInputElement.addEventListener('input', () => {
      // validate the input for valid variable name with regex
      // valid: letters, numbers and underscore
      const name = nameInputElement.value.toUpperCase()
      if (name.match(/^[A-Z0-9_]+$/g)) {
        this.name = nameInputElement.value.toUpperCase()
        this.isValid = true
        nameInputElement.classList.remove('is-invalid')
      } else {
        this.isValid = false
        nameInputElement.classList.add('is-invalid')
      }
    })
    valueInputElement.addEventListener(
      'input',
      () => (this.value = valueInputElement.value)
    )
    environmentElement
      .querySelector('#removeVariable')
      .addEventListener('click', () => {
        environmentElement.remove()
        environmentVariables.splice(environmentVariables.indexOf(this), 1)
      })

    if (this.name && this.value) {
      nameInputElement.value = this.name
      valueInputElement.value = this.value
      this.isValid = true
    } else {
      nameInputElement.classList.add('is-invalid')
    }
  }
}

document.getElementById('addEnvButton').onclick = (): void => {
  environmentVariables.push(new EnvironmentItem())
}

document.getElementById('submitEnvButton').onclick = (): void => {
  // check if there's at least one variable to submit
  if (environmentVariables.length === 0) {
    return alert('Error: add at least one variable before submitting.')
  }
  // check if all variables are valid
  if (environmentVariables.some(env => !env.isValid)) {
    return alert(
      'Error: some fields are not valid, please fix them before submitting.'
    )
  }
  // confirm if it's OK to restart the app and send the request
  if (
    confirm(
      'Submitting will recreate the container for your app.' +
        'All data not saved inside the main app folder will be lost. Is this OK?'
    )
  ) {
    // convert to the request body format
    // { variables: { NAME: value, ... }}
    const body = environmentVariables.reduce((acc, { name, value }) => {
      if (name && value) {
        acc[name] = value
      }
      return acc
    }, {})
    fetch(`/api/mappings/${fullDomain}/environment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ variables: body })
    })
      .then(response => (response.status !== 201 ? response.json() : {}))
      .then((body: ContainerResponse) =>
        body.message
          ? alert(`ERROR: ${body.message}`)
          : window.location.reload()
      )
  }
}

// Populate the list with existing environment variables
fetch(`/api/mappings/${fullDomain}/environment`)
  .then(r => r.json())
  .then(({ variables }) => {
    Object.entries(variables).forEach(([name, value]) => {
      environmentVariables.push(
        new EnvironmentItem(name as string, value as string)
      )
    })
  })
