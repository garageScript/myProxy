const envList = helper.getElement('.envList')
const environmentVariables: EnvironmentItem[] = []
const fullDomain = window.location.pathname.split('/').pop()
document.getElementById('full-domain').innerText = fullDomain

class EnvironmentItem {
  name: string
  value: string
  isValid = false

  private nameInputElement: HTMLInputElement
  private valueInputElement: HTMLInputElement

  private readonly IS_INVALID = 'is-invalid'
  private readonly LETTER_NUMBER_REGEX = /^[A-Z0-9_]+$/g
  private readonly ELEMENT_HTML = `
    <div class="input-group">
      <input 
        type="text"
        aria-label="Name"
        class="form-control text-uppercase text-monospace input-name"
        placeholder="NAME"
      >
      <div class="input-group-prepend input-group-append">
        <span class="input-group-text">=</span>
      </div>
      <input
        type="text"
        aria-label="Value"
        class="form-control text-monospace input-value"
        placeholder="Value"
      >
      <div class="input-group-append">
        <button
          class="btn btn-outline-danger button-remove"
          type="button"
        >
          Remove
        </button>
      </div>
      <div class="invalid-feedback">
        Name must contain only letters, number, or underscore.
      </div>
    </div>
  `

  constructor(name?: string, value?: string) {
    this.name = name
    this.value = value
    this.createElement()
  }

  /**
   * Create the list element and add the event listeners for inputs and button
   */
  private createElement(): void {
    const environmentElement = document.createElement('li')
    environmentElement.innerHTML = this.ELEMENT_HTML
    environmentElement.classList.add(
      'list-group-item',
      'd-flex',
      'align-items-center'
    )
    this.setInputValues()
    envList.appendChild(environmentElement)
    this.nameInputElement = environmentElement.querySelector('.input-name')
    this.valueInputElement = environmentElement.querySelector('.input-value')
    this.nameInputElement.addEventListener('input', () =>
      this.validateAndSetName(this.nameInputElement.value.toUpperCase())
    )
    this.valueInputElement.addEventListener(
      'input',
      () => (this.value = this.valueInputElement.value)
    )
    environmentElement
      .querySelector('.button-remove')
      .addEventListener('click', () => this.removeElement(environmentElement))
  }

  /**
   * Sets the input values if they exist. Called on element creation.
   */
  private setInputValues(): void {
    if (this.name && this.value) {
      this.nameInputElement.value = this.name
      this.valueInputElement.value = this.value
      this.isValid = true
    } else {
      this.nameInputElement.classList.add('is-invalid')
    }
  }

  /**
   * Validates the variable name with regex and sets the field if it's valid
   * @param upperCaseValue input value converted to upper case.
   */
  private validateAndSetName(upperCaseValue: string): void {
    if (upperCaseValue.match(this.LETTER_NUMBER_REGEX)) {
      this.name = upperCaseValue
      this.isValid = true
      this.nameInputElement.classList.remove(this.IS_INVALID)
    } else {
      this.isValid = false
      this.nameInputElement.classList.add(this.IS_INVALID)
    }
  }

  /**
   * Removes the list item element from the DOM and the items list.
   * @param element list item element
   */
  private removeElement(element: HTMLLIElement): void {
    element.remove()
    environmentVariables.splice(environmentVariables.indexOf(this), 1)
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
