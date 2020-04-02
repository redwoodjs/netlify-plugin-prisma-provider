const fs = require("fs");
const PROVIDER_REGEX = /^\s+provider\s+=\s+["']sqlite["']/m;

module.exports = {
  onPreBuild: ({ inputs }) => {
    const schema = fs.readFileSync(inputs.path).toString();
    const newProvider = `provider = "${process.env[inputs.varName] || "postgresql"}"`;

    if (schema.match(PROVIDER_REGEX)) {
      const newSchema = schema.replace(PROVIDER_REGEX, newProvider);

      fs.writeFileSync(inputs.path, newSchema);
      console.log(`  Replaced provider with \`${newProvider}\``);
    } else {
      console.log('  Skipping, provider is not "sqlite"');
    }
  }
};
