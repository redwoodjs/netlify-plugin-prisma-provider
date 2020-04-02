## Usage

Add the [[plugins]] table to your `netlify.toml` file:

```toml
[[plugins]]
package = 'netlify-plugin-prisma-provider'
  [plugins.inputs]
  path = 'prisma/schema.prisma'
```

Where `path` is the path to your schema file. It will default to `prisma/schema.prisma` if you do not override.
