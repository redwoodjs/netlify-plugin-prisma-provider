const fs = require('fs')
const PROVIDER_REGEX = /^\s+provider\s+=\s+["']sqlite["']/m
const NEW_PROVIDER_STRING = `provider = "${process.env.DATABASE_PROVIDER ||
  'postgresql'}"`

module.exports = {
  onPreBuild: ({ inputs }) => {
    const schema = fs.readFileSync(inputs.path).toString()

    if (schema.match(PROVIDER_REGEX)) {
      const newSchema = schema.replace(PROVIDER_REGEX, NEW_PROVIDER_STRING)

      fs.writeFileSync(inputs.path, newSchema)
      console.log(`Replaced provider with \`${NEW_PROVIDER_STRING}\``)
    }
  },
}
