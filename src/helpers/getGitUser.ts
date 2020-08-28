import util from 'util'
import cp from 'child_process'
const exec = util.promisify(cp.exec)

const getGitUserId = async (): Promise<number> => {
  const gitId = await exec('id -u myproxy')
  return parseInt(gitId.stdout, 10)
}

const getGitGroupId = async (): Promise<number> => {
  const gitId = await exec('getent group myproxy | cut -d: -f3')
  return parseInt(gitId.stdout, 10)
}

export { getGitUserId, getGitGroupId }
