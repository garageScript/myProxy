import Docker from 'dockerode'
import path from 'path'
import { Readable, PassThrough } from 'stream'
import environment from '../helpers/environment'

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

const getContainersList = async (): Promise<Docker.ContainerInfo[]> => {
  const containers = await docker.listContainers({ all: true })
  return containers
}

const getContainerLogs = async (
  id: string,
  options: Docker.ContainerLogsOptions
): Promise<NodeJS.ReadableStream> => {
  const container = docker.getContainer(id)
  let logs = await container.logs(options)
  if (!options.follow) {
    // if follow = false, the logs are returned as a buffer
    // so we need to convert into a stream
    logs = Readable.from(logs)
  }
  const demuxedStream = new PassThrough()
  container.modem.demuxStream(logs, demuxedStream, demuxedStream)
  logs.on('end', () => demuxedStream.end())
  return demuxedStream
}

const createContainer = async (
  fullDomain: string,
  port: number,
  environmentVariables: string[] = []
): Promise<string> => {
  const workPath = path.resolve(environment.WORKPATH, fullDomain)
  return docker
    .createContainer({
      Image: 'devwong0305/myproxy-node:latest', // Image should be copied to GarageScript account later so its more official. This is a node:alpine image with git installed.
      name: fullDomain,
      User: 'node',
      ExposedPorts: {
        '3000/tcp': {}
      },
      Tty: false,
      WorkingDir: '/home/node/app',
      Env: ['NODE_ENV=production', 'PORT=3000', ...environmentVariables],
      HostConfig: {
        Binds: [`${workPath}:/home/node/app`],
        RestartPolicy: {
          Name: 'on-failure',
          MaximumRetryCount: 3
        },
        LogConfig: {
          Type: 'json-file',
          Config: {
            'max-size': '10m',
            'max-file': '1'
          }
        },
        PortBindings: {
          '3000/tcp': [
            {
              HostIp: '',
              HostPort: port.toString()
            }
          ]
        }
      },
      Cmd: ['npm', 'run', 'start']
    })
    .then(container => container.id)
    .catch(err => err)
}

const startContainer = async (id: string): Promise<unknown> => {
  const container = docker.getContainer(id)
  return container.restart()
}

const stopContainer = async (id: string): Promise<unknown> => {
  const container = docker.getContainer(id)
  return container.stop()
}

const removeContainer = async (id: string): Promise<unknown> => {
  const container = docker.getContainer(id)
  return container.remove({ v: true, force: true })
}

const inspectContainer = (id: string): Promise<Docker.ContainerInspectInfo> => {
  const container = docker.getContainer(id)
  return container.inspect()
}

export {
  getContainersList,
  getContainerLogs,
  createContainer,
  startContainer,
  stopContainer,
  removeContainer,
  inspectContainer
}
