const fs = require('fs')
const path = require('path')

const glob = require('glob')
const PROVIDER_REGEX = /^\s*provider\s+=\s+["']sqlite["']/m
const STEPS_REGEX = /\\"sqlite\\"/
const DEFAULT_PROVIDER = 'postgresql'

const replaceProvider = (filePath, options = {}) => {
  const content = fs.readFileSync(filePath).toString()

  if (content.match(options.regex)) {
    const newContent = content.replace(options.regex, options.replace)

    fs.writeFileSync(filePath, newContent)
    console.log(
      `  Replaced provider with \`${options.replace}\` in ${filePath}`
    )
  } else {
    console.log(`  Skipping, provider is not "sqlite" in ${filePath}`)
  }
}

module.exports = {
  onPreBuild: ({ inputs }) => {
    console.log('Replacing provider in schema.prisma...')
    replaceProvider(inputs.path, {
      regex: PROVIDER_REGEX,
      replace: `provider = "${
        process.env[inputs.varName] || DEFAULT_PROVIDER
      }"`,
    })

    console.log('Replacing providers in migrations schema.prisma...')
    const pathParts = inputs.path.split('/')
    pathParts.splice(pathParts.length - 1, 0, 'migrations', '**')
    glob.sync(path.join(...pathParts)).forEach((file) => {
      replaceProvider(file, {
        regex: PROVIDER_REGEX,
        replace: `provider = "${
          process.env[inputs.varName] || DEFAULT_PROVIDER
        }"`,
      })
    })

    console.log('Replacing providers in migrations steps.json...')
    const migrationStepsPath = pathParts
    migrationStepsPath.splice(pathParts.length - 1, 1, 'steps.json')
    glob.sync(path.join(...migrationStepsPath)).forEach((file) => {
      replaceProvider(file, {
        regex: STEPS_REGEX,
        replace: `\\"${process.env[inputs.varName] || DEFAULT_PROVIDER}\\"`,
      })
    })
  },
}
