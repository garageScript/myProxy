import util from 'util'
import cp from 'child_process'
const exec = util.promisify(cp.exec)

const getGitUserId = async (): Promise<number> => {
  const gitId = await exec('id -u git')
  return parseInt(gitId.stdout, 10)
}

export { getGitUserId }
