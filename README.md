# netlify-plugin-prisma-provider

Currently, if you're using [Prisma](https://prisma.io) to talk to your database, there is no way to set the database provider dynamically. The `url` connection string can be set via ENV var, but not the `provider`:

```
// schema.prisma

datasource DS {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

If you want to use a SQLite database locally, but use Postgres in production, there is no way to swap out the provider `"sqlite"` for `"postgresql"` once you go to production—the string for the provider *must* be present in this file before Prisma generates the client libraries.

Prisma has an [open issue](https://github.com/prisma/prisma2/issues/1487) for letting you set this value via ENV var but there is no planned release date.

Until then, this plugin will swap out the provider for you right before your code is built on Netlify. You can set your preferred production database provider as an environment variable and it will be swapped into `schema.prisma` right before the build begins.

> NOTE: The plugin will only replace the `provider` if its value is `sqlite`. If `postgresql` or `mysql` is present then the replacement is skipped. If switching between Postgres and MySQL in development and production is needed, open an issue and I'll update the plugin to support this scenario!

As of Prisma's [beta3](https://github.com/prisma/prisma/releases/tag/2.0.0-beta.3) release their migration scripts look at the `provider` in each migration's snapshot of `schema.prisma` and compare those against the `url` in the main `schema.prisma`. If the protocol doesn't match the provider it will raise an error during the migration. Starting in version 0.3.0 of this plugin, we will also replace the provider in each of the migration snapshots' copy of `schema.prisma` and `steps.json`.

## Usage

Add a `[[plugins]]` entry to your `netlify.toml` file:

```toml
[[plugins]]
package = 'netlify-plugin-prisma-provider'
  [plugins.inputs]
  path = 'prisma/schema.prisma'
  varName = 'DATABASE_PROVIDER'
```

| name | description | default |
|------|-------------|---------|
| `path` | The path to the schema.prisma file, relative to the root of your codebase. | `prisma/schema.prisma` |
| `varName` | The name of the ENV variable that contains the provider name. | `DATABASE_PROVIDER` |

Add the environment variable in Netlify with the name you provided `varName` and a value of `postgresql` or `mysql`:

![image](https://user-images.githubusercontent.com/300/78293488-79e70880-74dd-11ea-8052-f09e5c47ecc8.png)

If you don't set the environment variable it will assume you want to use `postgresql` and will replace that in your `schema.prisma`. If you don't want that to happen then you'll need to remove this plugin completely!
