// from https://github.com/zeit/next.js/blob/canary/packages/create-next-app/helpers/should-use-yarn.ts

import { execSync } from 'child_process'

export function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}