const fs = require('fs')
const path = require('path')

const PUBLISHABLE_PACKAGES = ['core', 'canvas', 'selecto', 'sketch-ruler']
const DEPENDENCY_FIELDS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']

function findWorkspaceDependencies() {
  const offenders = []

  for (const name of PUBLISHABLE_PACKAGES) {
    const pkgPath = path.resolve(__dirname, '../packages', name, 'package.json')
    if (!fs.existsSync(pkgPath)) continue

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

    for (const field of DEPENDENCY_FIELDS) {
      const deps = pkg[field]
      if (!deps) continue

      for (const [depName, range] of Object.entries(deps)) {
        if (typeof range === 'string' && range.startsWith('workspace:')) {
          offenders.push(`${pkg.name} [${field}] ${depName}: ${range}`)
        }
      }
    }
  }

  return offenders
}

function main() {
  const offenders = findWorkspaceDependencies()

  if (offenders.length === 0) {
    console.log('Publish manifest OK: no workspace: protocol left.')
    return
  }

  console.error('Refusing to publish: workspace: protocol found in publish manifests:')
  offenders.forEach((item) => console.error(`  - ${item}`))
  console.error('Use `pnpm release <version>` so cross-package versions are rewritten before publishing.')
  process.exitCode = 1
}

if (require.main === module) main()

module.exports = { findWorkspaceDependencies }
