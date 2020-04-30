const fs = require('fs')
const path = require('path')

const glob = require('glob')
const PROVIDER_REGEX = /^\s*provider\s+=\s+["']sqlite["']/m

const replaceProvider = (path, varName) => {
  const schema = fs.readFileSync(path).toString()
  const newProvider = `provider = "${process.env[varName] || 'postgresql'}"`

  if (schema.match(PROVIDER_REGEX)) {
    const newSchema = schema.replace(PROVIDER_REGEX, newProvider)

    fs.writeFileSync(path, newSchema)
    console.log(`  Replaced provider with \`${newProvider}\` in ${path}`)
  } else {
    console.log(`  Skipping, provider is not "sqlite" in ${path}`)
  }
}

module.exports = {
  onPreBuild: ({ inputs }) => {
    console.log('Replacing provider in schema.prisma...')
    replaceProvider(inputs.path, inputs.varName)

    console.log('Replacing providers in migrations...')
    const pathParts = inputs.path.split('/')
    pathParts.splice(pathParts.length - 1, 0, 'migrations', '**')
    const migrationPath = path.join(...pathParts)

    glob.sync(migrationPath).forEach((file) => {
      replaceProvider(file, inputs.varName)
    })
  },
}
