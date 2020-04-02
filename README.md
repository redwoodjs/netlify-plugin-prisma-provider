# netlify-plugin-prisma-provider

Currently, if you're using [Prisma](https://prisma.io) to talk to your database, there is no way to set the database provider dyanamically. So if you want to use a SQLite database locally, but use Postgres in production, there is no way to swap out the provider `"sqlite"` for `"postgresql"` dynamically, like with an ENV var. Prisma has an [open issue](https://github.com/prisma/prisma2/issues/1487) for fixing this issue, but there is no release date.

Until then, this plugin will swap out the provider for you right before your code is built on Netlify. You can set your preferred production database provider as an envirnoment variable and it will be swapped into `schema.prisma` right before the build begins (only if the `provider` that's already in `schema.prisma` is `"sqlite"`, otherwise it is ignored.

## Usage

Add the `[[plugins]]` entry to your `netlify.toml` file:

```toml
[[plugins]]
package = 'netlify-plugin-prisma-provider'
  [plugins.inputs]
  path = 'prisma/schema.prisma'
  varName = 'DATABASE_PROVIDER`
```

| name | description | default |
|------|-------------|---------|
| `path` | The path to the schema.prisma file, relative to the root of your codebase. | `prisma/schema.prisma` |
| `varName` | The name of the ENV variable that contains the provider name. Prisma currently supports "postgresql" and "mysql" as values for this variable. | `DATABASE_PROVIDER` |

Then just create the environment variable in Netlify with the name you provided `varName` and a value of `postgresql` or `mysql`:

![image](https://user-images.githubusercontent.com/300/78293488-79e70880-74dd-11ea-8052-f09e5c47ecc8.png)

If you don't set the environment variable it will assume you want to use `postgresql` and will replace that in your `schema.prisma`. If you don't want that to happen then you'll need to remove this plugin completely!
