type DockerError = {
  reason: string
  statusCode: number
  json: {
    message: string
  }
}

export { DockerError }
