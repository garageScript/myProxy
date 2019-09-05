// eslint-disable-next-line
const helper = {
  getElement: (query: string, root?: HTMLElement): HTMLElement => {
    if (!root) {
      return (
        document.querySelector<HTMLElement>(query) ||
        (document.createElement('div') as HTMLElement)
      )
    }
    return (
      root.querySelector(query) ||
      (document.createElement('div') as HTMLElement)
    )
  }
}
