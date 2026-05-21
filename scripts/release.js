const { execSync } = require('child_process')
let chalk
async function loadChalk() {
  if (!chalk) {
    chalk = (await import('chalk')).default
  }
  return chalk
}
const path = require('path')
const fs = require('fs')

const semver = require('semver')
const { prompt } = require('enquirer')
const args = require('minimist')(process.argv.slice(2))
const currentVersion = require('../packages/sketch-ruler/package.json').version

const packages = ['core', 'canvas', 'sketch-ruler']

const versionIncrements = ['patch', 'minor', 'major']
const step = (msg) => console.log(chalk.cyan(msg))
const getPkgRoot = (pkg) => path.resolve(__dirname, '../packages/' + pkg)

const inc = (i) => semver.inc(currentVersion, i)

async function main() {
  await loadChalk()
  let targetVersion = args._[0]

  // 如果没有传入版本，提示选择
  if (!targetVersion) {
    // no explicit version, offer suggestions
    const { release } = await prompt({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: versionIncrements.map((i) => `${i} (${inc(i)})`).concat(['custom'])
    })

    if (release === 'custom') {
      targetVersion = (
        await prompt({
          type: 'input',
          name: 'version',
          message: 'Input custom version',
          initial: currentVersion
        })
      ).version
    } else {
      targetVersion = release.match(/\((.*)\)/)[1]
    }
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`)
  }

  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`
  })

  if (!yes) {
    return
  }

  // 记录原始的 workspace:* 依赖，以便发版后恢复
  const originalDeps = new Map()

  // update all package versions and inter-dependencies
  step('\nUpdating cross dependencies...')
  updateVersions(targetVersion, originalDeps)

  // publish packages
  step('\nPublishing packages...')

  try {
    for (const pkg of packages) {
      await publishPackage(pkg, targetVersion)
    }
  } finally {
    // 无论发布成功还是失败，都把依赖恢复为 workspace:*
    step('\nRestoring workspace dependencies...')
    restoreWorkspaceDeps(originalDeps)
  }
}

main()

function updateVersions(version, originalDepsMap) {
  // 1. update root package.json
  updatePackage(path.resolve(__dirname, '..'), version)
  // 2. update all packages
  packages.forEach((p) => updatePackage(getPkgRoot(p), version, version, originalDepsMap))
}

function updatePackage(pkgRoot, version, depVersion, originalDepsMap) {
  const pkgPath = path.resolve(pkgRoot, 'package.json')
  const raw = fs.readFileSync(pkgPath, 'utf-8')
  const pkg = JSON.parse(raw)
  pkg.version = version

  // 同步 sketch-ruler 和 canvas 的 @sketch-ruler/* 依赖版本
  if (pkg.dependencies) {
    ;['@sketch-ruler/core', '@sketch-ruler/canvas'].forEach((depKey) => {
      if (pkg.dependencies[depKey] === 'workspace:*') {
        if (originalDepsMap) {
          if (!originalDepsMap.has(pkgPath)) {
            originalDepsMap.set(pkgPath, {})
          }
          originalDepsMap.get(pkgPath)[depKey] = 'workspace:*'
        }
        pkg.dependencies[depKey] = depVersion
      }
    })
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

function restoreWorkspaceDeps(originalDepsMap) {
  for (const [pkgPath, deps] of originalDepsMap) {
    const raw = fs.readFileSync(pkgPath, 'utf-8')
    const pkg = JSON.parse(raw)
    if (!pkg.dependencies) continue

    Object.keys(deps).forEach((key) => {
      if (pkg.dependencies[key] !== undefined) {
        pkg.dependencies[key] = deps[key]
      }
    })

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
  }
}

async function publishPackage(pkgName, version) {
  const pkgRoot = getPkgRoot(pkgName)
  const pkgPath = path.resolve(pkgRoot, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

  if (pkg.private) {
    return
  }

  step(`Publishing ${pkgName}...`)
  console.log(pkgRoot, 'pkgRootpkgRoot')

  try {
    // 只有 sketch-ruler 包需要 copy README.md
    if (pkgName === 'sketch-ruler') {
      step(`copy README.md...`)
      fs.cpSync(path.resolve(__dirname, '../README.md'), path.resolve(pkgRoot, 'README.md'))
    }

    execSync('npm publish', { cwd: pkgRoot, stdio: 'inherit' })

    console.log(chalk.green(`Successfully published ${pkgName}@${version}`))
  } catch (e) {
    const stderrStr = e.stderr ? e.stderr.toString() : ''
    if (stderrStr.match(/previously published/)) {
      console.log(chalk.red(`Skipping already published: ${pkgName}`))
    } else {
      throw e
    }
  }
}
