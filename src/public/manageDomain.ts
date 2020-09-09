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
        class="form-control text-uppercase text-monospace name-input ${this.IS_INVALID}"
        placeholder="NAME"
      >
      <div class="input-group-prepend input-group-append">
        <span class="input-group-text">=</span>
      </div>
      <input
        type="text"
        aria-label="Value"
        class="form-control text-monospace value-input"
        placeholder="Value"
      >
      <div class="input-group-append">
        <button
          class="btn btn-outline-danger remove-button"
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
    if (name && value) {
      this.setInputValues()
    }
    this.nameInputElement.focus()
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
    envList.appendChild(environmentElement)
    this.nameInputElement = environmentElement.querySelector('.name-input')
    this.valueInputElement = environmentElement.querySelector('.value-input')
    this.nameInputElement.addEventListener('input', () =>
      this.validateAndSetName(this.nameInputElement.value.toUpperCase())
    )
    this.valueInputElement.addEventListener(
      'input',
      () => (this.value = this.valueInputElement.value)
    )
    environmentElement
      .querySelector('.remove-button')
      .addEventListener('click', () => this.removeElement(environmentElement))
  }

  /**
   * Sets the input values if they exist. Called on object constructor.
   */
  private setInputValues(): void {
    this.nameInputElement.value = this.name
    this.valueInputElement.value = this.value
    this.isValid = true
    this.nameInputElement.classList.remove(this.IS_INVALID)
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
      acc[name] = value
      return acc
    }, {})
    // send the PUT request
    // show alert with error if request is not successful
    fetch(`/api/mappings/${fullDomain}/environment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ variables: body })
    })
      .then(response => (response.ok ? {} : response.json()))
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
