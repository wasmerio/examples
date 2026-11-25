Astro DB
========

Astro DB is a fully-managed SQL database designed for the Astro ecosystem. Develop locally in Astro and deploy to any libSQL-compatible database.

Astro DB is a complete solution to configuring, developing, and querying your data. A local database is created in `.astro/content.db` whenever you run `astro dev` to manage your data without the need for Docker or a network connection.

Installation
------------

[Section titled Installation](https://docs.astro.build/en/guides/astro-db/#installation)

Install the [`@astrojs/db` integration](https://docs.astro.build/en/guides/integrations-guide/db/) using the built-in `astro add` command:

-   [npm](https://docs.astro.build/en/guides/astro-db/#tab-panel-424)
-   [pnpm](https://docs.astro.build/en/guides/astro-db/#tab-panel-425)
-   [Yarn](https://docs.astro.build/en/guides/astro-db/#tab-panel-426)

Terminal window

```
npx astro add db
```

Define your database
--------------------

[Section titled Define your database](https://docs.astro.build/en/guides/astro-db/#define-your-database)

Installing `@astrojs/db` with the `astro add` command will automatically create a `db/config.ts` file in your project where you will define your database tables:

db/config.ts

```
import { defineDb } from 'astro:db';
export default defineDb({  tables: { },})
```

### Tables

[Section titled Tables](https://docs.astro.build/en/guides/astro-db/#tables)

Data in Astro DB is stored using SQL tables. Tables structure your data into rows and columns, where columns enforce the type of each row value.

Define your tables in your `db/config.ts` file by providing the structure of the data in your existing libSQL database, or the data you will collect in a new database. This will allow Astro to generate a TypeScript interface to query that table from your project. The result is full TypeScript support when you access your data with property autocompletion and type-checking.

To configure a database table, import and use the `defineTable()` and `column` utilities from `astro:db`. Then, define a name (case-sensitive) for your table and the type of data in each column.

This example configures a `Comment` table with required text columns for `author` and `body`. Then, makes it available to your project through the `defineDb()` export.

db/config.ts

```
import { defineDb, defineTable, column } from 'astro:db';
const Comment = defineTable({  columns: {    author: column.text(),    body: column.text(),  }})
export default defineDb({  tables: { Comment },})
```

See the [table configuration reference](https://docs.astro.build/en/guides/integrations-guide/db/#table-configuration-reference) for a complete reference of table options.

### Columns

[Section titled Columns](https://docs.astro.build/en/guides/astro-db/#columns)

Astro DB supports the following column types:

db/config.ts

```
import { defineTable, column } from 'astro:db';
const Comment = defineTable({  columns: {    // A string of text.    author: column.text(),    // A whole integer value.    likes: column.number(),    // A true or false value.    flagged: column.boolean(),    // Date/time values queried as JavaScript Date objects.    published: column.date(),    // An untyped JSON object.    metadata: column.json(),  }});
```

See the [table columns reference](https://docs.astro.build/en/guides/integrations-guide/db/#table-configuration-reference) for more details.

### Table References

[Section titled Table References](https://docs.astro.build/en/guides/astro-db/#table-references)

Relationships between tables are a common pattern in database design. For example, a `Blog` table may be closely related to other tables of `Comment`, `Author`, and `Category`.

You can define these relations between tables and save them into your database schema using **reference columns**. To establish a relationship, you will need:

-   An **identifier column** on the referenced table. This is usually an `id` column with the `primaryKey` property.
-   A column on the base table to **store the referenced `id`**. This uses the `references` property to establish a relationship.

This example shows a `Comment` table's `authorId` column referencing an `Author` table's `id` column.

db/config.ts

```
const Author = defineTable({  columns: {    id: column.number({ primaryKey: true }),    name: column.text(),  }});
const Comment = defineTable({  columns: {    authorId: column.number({ references: () => Author.columns.id }),    body: column.text(),  }});
```

Seed your database for development
----------------------------------

[Section titled Seed your database for development](https://docs.astro.build/en/guides/astro-db/#seed-your-database-for-development)

In development, Astro will use your DB config to generate local types according to your schemas. These will be generated fresh from your seed file each time the dev server is started, and will allow you to query and work with the shape of your data with type safety and autocompletion.

You will not have access to production data during development unless you [connect to a remote database](https://docs.astro.build/en/guides/astro-db/#connecting-to-remote-databases) during development. This protects your data while allowing you to test and develop with a working database with type-safety.

To seed development data for testing and debugging into your Astro project, create a `db/seed.ts` file. Import both the `db` object and your tables defined in `astro:db`. `insert` some initial data into each table. This development data should match the form of both your database schema and production data.

The following example defines two rows of development data for a `Comment` table, and an `Author` table:

db/seed.ts

```
import { db, Comment, Author } from 'astro:db';
export default async function() {  await db.insert(Author).values([    { id: 1, name: "Kasim" },    { id: 2, name: "Mina" },  ]);
  await db.insert(Comment).values([    { authorId: 1, body: 'Hope you like Astro DB!' },    { authorId: 2, body: 'Enjoy!'},  ])}
```

Your development server will automatically restart your database whenever this file changes, regenerating your types and seeding this development data from `seed.ts` fresh each time.

Connect a libSQL database for production
----------------------------------------

[Section titled Connect a libSQL database for production](https://docs.astro.build/en/guides/astro-db/#connect-a-libsql-database-for-production)

Astro DB can connect to any local libSQL database or to any server that exposes the libSQL remote protocol, whether managed or self-hosted.

To connect Astro DB to a libSQL database, set the following environment variables obtained from your database provider:

-   `ASTRO_DB_REMOTE_URL`: the connection URL to the location of your local or remote libSQL DB. This may include [URL configuration options](https://docs.astro.build/en/guides/astro-db/#remote-url-configuration-options) such as sync and encryption as parameters.
-   `ASTRO_DB_APP_TOKEN`: the auth token to your libSQL server. This is required for remote databases, and not needed for [local DBs like files or in-memory](https://docs.astro.build/en/guides/astro-db/#url-scheme-and-host) databases

Depending on your service, you may have access to a CLI or web UI to retrieve these values. The following section will demonstrate connecting to Turso and setting these values as an example, but you are free to use any provider.

### Getting started with Turso

[Section titled Getting started with Turso](https://docs.astro.build/en/guides/astro-db/#getting-started-with-turso)

Turso is the company behind [libSQL](https://github.com/tursodatabase/libsql), the open-source fork of SQLite that powers Astro DB. They provide a fully managed libSQL database platform and are fully compatible with Astro.

The steps below will guide you through the process of installing the Turso CLI, logging in (or signing up), creating a new database, getting the required environmental variables, and pushing the schema to the remote database.

1.  Install the [Turso CLI](https://docs.turso.tech/cli/installation).

2.  [Log in or sign up](https://docs.turso.tech/cli/authentication) to Turso.

3.  Create a new database. In this example the database name is `andromeda`.

    Terminal window

    ```
    turso db create andromeda
    ```

4.  Run the `show` command to see information about the newly created database:

    Terminal window

    ```
    turso db show andromeda
    ```

    Copy the `URL` value and set it as the value for `ASTRO_DB_REMOTE_URL`.

    .env

    ```
    ASTRO_DB_REMOTE_URL=libsql://andromeda-houston.turso.io
    ```

5.  Create a new token to authenticate requests to the database:

    Terminal window

    ```
    turso db tokens create andromeda
    ```

    Copy the output of the command and set it as the value for `ASTRO_DB_APP_TOKEN`.

    .env

    ```
    ASTRO_DB_REMOTE_URL=libsql://andromeda-houston.turso.ioASTRO_DB_APP_TOKEN=eyJhbGciOiJF...3ahJpTkKDw
    ```

6.  Push your DB schema and metadata to the new Turso database.

    Terminal window

    ```
    astro db push --remote
    ```

7.  Congratulations, now you have a database connected! Give yourself a break. 👾

    Terminal window

    ```
    turso relax
    ```

To explore more features of Turso, check out the [Turso docs](https://docs.turso.tech/).

### Connecting to remote databases

[Section titled Connecting to remote databases](https://docs.astro.build/en/guides/astro-db/#connecting-to-remote-databases)

Astro DB allows you to connect to both local and remote databases. By default, Astro uses a local database file for `dev` and `build` commands, recreating tables and inserting development seed data each time.

To connect to a hosted remote database, use the `--remote` flag. This flag enables both readable and writable access to your remote database, allowing you to [accept and persist user data](https://docs.astro.build/en/guides/astro-db/#insert) in production environments.

Note

While remote connections are generally possible with any deployment platform using static or server rendering mode, there are currently some limitations. Non-Node runtimes like Cloudflare and Deno don't currently support DB on server-rendered routes when using libSQL. Support for these platforms is planned for future implementation.

Configure your build command to use the `--remote` flag:

package.json

```
{  "scripts": {    "build": "astro build --remote"  }}
```

You can also use the flag directly in the command line:

Terminal window

```
# Build with a remote connectionastro build --remote
# Develop with a remote connectionastro dev --remote
```

Caution

Be careful when using `--remote` in development. This connects to your live production database, and all changes (inserts, updates, deletions) will be persisted.

The `--remote` flag uses the connection to the remote DB both locally during the build and on the server. Ensure you set the necessary environment variables in both your local development environment and your deployment platform.

When deploying your Astro DB project, make sure your deployment platform's build command is set to `npm run build` (or the equivalent for your package manager) to utilize the `--remote` flag configured in your `package.json`.

### Remote URL configuration options

[Section titled Remote URL configuration options](https://docs.astro.build/en/guides/astro-db/#remote-url-configuration-options)

The `ASTRO_DB_REMOTE_URL` environment variable configures the location of your database as well as other options like sync and encryption.

#### URL scheme and host

[Section titled URL scheme and host](https://docs.astro.build/en/guides/astro-db/#url-scheme-and-host)

libSQL supports both HTTP and WebSockets as the transport protocol for a remote server. It also supports using a local file or an in-memory DB. Those can be configured using the following URL schemes in the connection URL:

-   `memory:` will use an in-memory DB. The host must be empty in this case.
-   `file:` will use a local file. The host is the path to the file (`file:path/to/file.db`).
-   `libsql:` will use a remote server through the protocol preferred by the library (this might be different across versions). The host is the address of the server (`libsql://your.server.io`).
-   `http:` will use a remote server through HTTP. `https:` can be used to enable a secure connection. The host is the same as for `libsql:`.
-   `ws:` will use a remote server through WebSockets. `wss:` can be used to enable a secure connection. The host is the same as for `libsql:`.

Details of the libSQL connection (e.g. encryption key, replication, sync interval) can be configured as query parameters in the remote connection URL.

For example, to have an encrypted local file work as an embedded replica to a libSQL server, you can set the following environment variables:

.env

```
ASTRO_DB_REMOTE_URL=file://local-copy.db?encryptionKey=your-encryption-key&syncInterval=60&syncUrl=libsql%3A%2F%2Fyour.server.ioASTRO_DB_APP_TOKEN=token-to-your-remote-url
```

Caution

Using a database file is an advanced feature, and care should be taken when deploying to prevent overriding your database and losing your production data.

Additionally, this method will not work in serverless deployments, as the file system is not persisted in those environments.

#### `encryptionKey`

[Section titled encryptionKey](https://docs.astro.build/en/guides/astro-db/#encryptionkey)

libSQL has native support for encrypted databases. Passing this search parameter will enable encryption using the given key:

.env

```
ASTRO_DB_REMOTE_URL=file:path/to/file.db?encryptionKey=your-encryption-key
```

#### `syncUrl`

[Section titled syncUrl](https://docs.astro.build/en/guides/astro-db/#syncurl)

Embedded replicas are a feature of libSQL clients that creates a full synchronized copy of your database on a local file or in memory for ultra-fast reads. Writes are sent to a remote database defined on the `syncUrl` and synchronized with the local copy.

Use this property to pass a separate connection URL to turn the database into an embedded replica of another database. This should only be used with the schemes `file:` and `memory:`. The parameter must be URL encoded.

For example, to have an in-memory embedded replica of a database on `libsql://your.server.io`, you can set the connection URL as such:

.env

```
ASTRO_DB_REMOTE_URL=memory:?syncUrl=libsql%3A%2F%2Fyour.server.io
```

#### `syncInterval`

[Section titled syncInterval](https://docs.astro.build/en/guides/astro-db/#syncinterval)

Interval between embedded replica synchronizations in seconds. By default it only synchronizes on startup and after writes.

This property is only used when `syncUrl` is also set. For example, to set an in-memory embedded replica to synchronize every minute set the following environment variable:

.env

```
ASTRO_DB_REMOTE_URL=memory:?syncUrl=libsql%3A%2F%2Fyour.server.io&syncInterval=60
```

Query your database
-------------------

[Section titled Query your database](https://docs.astro.build/en/guides/astro-db/#query-your-database)

You can query your database from any [Astro page](https://docs.astro.build/en/basics/astro-pages/#astro-pages), [endpoint](https://docs.astro.build/en/guides/endpoints/), or [action](https://docs.astro.build/en/guides/actions/) in your project using the provided `db` ORM and query builder.

### Drizzle ORM

[Section titled Drizzle ORM](https://docs.astro.build/en/guides/astro-db/#drizzle-orm)

```
import { db } from 'astro:db';
```

Astro DB includes a built-in [Drizzle ORM](https://orm.drizzle.team/) client. There is no setup or manual configuration required to use the client. The Astro DB `db` client is automatically configured to communicate with your database (local or remote) when you run Astro. It uses your exact database schema definition for type-safe SQL queries with TypeScript errors when you reference a column or table that doesn't exist.

### Select

[Section titled Select](https://docs.astro.build/en/guides/astro-db/#select)

The following example selects all rows of a `Comment` table. This returns the complete array of seeded development data from `db/seed.ts` which is then available for use in your page template:

src/pages/index.astro

```
---import { db, Comment } from 'astro:db';
const comments = await db.select().from(Comment);---
<h2>Comments</h2>
{  comments.map(({ author, body }) => (    <article>      <p>Author: {author}</p>      <p>{body}</p>    </article>  ))}
```

See the [Drizzle `select()` API reference](https://orm.drizzle.team/docs/select) for a complete overview.

### Insert

[Section titled Insert](https://docs.astro.build/en/guides/astro-db/#insert)

To accept user input, such as handling form requests and inserting data into your remote hosted database, configure your Astro project for [on-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/) and [add an adapter](https://docs.astro.build/en/guides/on-demand-rendering/#add-an-adapter) for your deployment environment.

This example inserts a row into a `Comment` table based on a parsed form POST request:

src/pages/index.astro

```
---import { db, Comment } from 'astro:db';
if (Astro.request.method === 'POST') {  // Parse form data  const formData = await Astro.request.formData();  const author = formData.get('author');  const body = formData.get('body');  if (typeof author === 'string' && typeof body === 'string') {    // Insert form data into the Comment table    await db.insert(Comment).values({ author, body });  }}
// Render the new list of comments on each requestconst comments = await db.select().from(Comment);---
<form method="POST" style="display: grid">  <label for="author">Author</label>  <input id="author" name="author" />
  <label for="body">Body</label>  <textarea id="body" name="body"></textarea>
  <button type="submit">Submit</button></form>
<!-- Render `comments` -->
```

You can also use [Astro actions](https://docs.astro.build/en/guides/actions/) to insert data into an Astro DB table. The following example inserts a row into a `Comment` table using an action:

src/actions/index.ts

```
import { db, Comment } from 'astro:db';import { defineAction } from 'astro:actions';import { z } from 'astro:schema';
export const server = {  addComment: defineAction({    // Actions include type safety with Zod, removing the need    // to check if typeof {value} === 'string' in your pages    input: z.object({      author: z.string(),      body: z.string(),    }),    handler: async (input) => {      const updatedComments = await db        .insert(Comment)        .values(input)        .returning(); // Return the updated comments      return updatedComments;    },  }),};
```

See the [Drizzle `insert()` API reference](https://orm.drizzle.team/docs/insert) for a complete overview.

### Delete

[Section titled Delete](https://docs.astro.build/en/guides/astro-db/#delete)

You can also query your database from an API endpoint. This example deletes a row from a `Comment` table by the `id` parameter:

src/pages/api/comments/[id].ts

```
import type { APIRoute } from "astro";import { db, Comment, eq } from 'astro:db';
export const DELETE: APIRoute = async (ctx) => {  await db.delete(Comment).where(eq(Comment.id, ctx.params.id ));  return new Response(null, { status: 204 });}
```

See the [Drizzle `delete()` API reference](https://orm.drizzle.team/docs/delete) for a complete overview.

### Filtering

[Section titled Filtering](https://docs.astro.build/en/guides/astro-db/#filtering)

To query for table results by a specific property, use [Drizzle options for partial selects](https://orm.drizzle.team/docs/select#partial-select). For example, add [a `.where()` call](https://orm.drizzle.team/docs/select#filtering) to your `select()` query and pass the comparison you want to make.

The following example queries for all rows in a `Comment` table that contain the phrase "Astro DB." Use [the `like()` operator](https://orm.drizzle.team/docs/operators#like) to check if a phrase is present within the `body`:

src/pages/index.astro

```
---import { db, Comment, like } from 'astro:db';
const comments = await db.select().from(Comment).where(    like(Comment.body, '%Astro DB%'));---
```

### Drizzle utilities

[Section titled Drizzle utilities](https://docs.astro.build/en/guides/astro-db/#drizzle-utilities)

All Drizzle utilities for building queries are exposed from the `astro:db` module. This includes:

-   [Filter operators](https://orm.drizzle.team/docs/operators) like `eq()` and `gt()`
-   [Aggregation helpers](https://orm.drizzle.team/docs/select#aggregations-helpers) like `count()`
-   [The `sql` helper](https://orm.drizzle.team/docs/sql) for writing raw SQL queries

```
import { eq, gt, count, sql } from 'astro:db';
```

### Relationships

[Section titled Relationships](https://docs.astro.build/en/guides/astro-db/#relationships)

You can query related data from multiple tables using a SQL join. To create a join query, extend your `db.select()` statement with a join operator. Each function accepts a table to join with and a condition to match rows between the two tables.

This example uses an `innerJoin()` function to join `Comment` authors with their related `Author` information based on the `authorId` column. This returns an array of objects with each `Author` and `Comment` row as top-level properties:

src/pages/index.astro

```
---import { db, eq, Comment, Author } from 'astro:db';
const comments = await db.select()  .from(Comment)  .innerJoin(Author, eq(Comment.authorId, Author.id));---
<h2>Comments</h2>
{  comments.map(({ Author, Comment }) => (    <article>      <p>Author: {Author.name}</p>      <p>{Comment.body}</p>    </article>  ))}
```

See the [Drizzle join reference](https://orm.drizzle.team/docs/joins#join-types) for all available join operators and config options.

### Batch Transactions

[Section titled Batch Transactions](https://docs.astro.build/en/guides/astro-db/#batch-transactions)

All remote database queries are made as a network request. You may need to "batch" queries together into a single transaction when making a large number of queries, or to have automatic rollbacks if any query fails.

This example seeds multiple rows in a single request using the `db.batch()` method:

db/seed.ts

```
import { db, Author, Comment } from 'astro:db';
export default async function () {  const queries = [];  // Seed 100 sample comments into your remote database  // with a single network request.  for (let i = 0; i < 100; i++) {    queries.push(db.insert(Comment).values({ body: `Test comment ${i}` }));  }  await db.batch(queries);}
```

See the [Drizzle `db.batch()`](https://orm.drizzle.team/docs/batch-api) docs for more details.

Pushing changes to your database
--------------------------------

[Section titled Pushing changes to your database](https://docs.astro.build/en/guides/astro-db/#pushing-changes-to-your-database)

You can push changes made during development to your database.

### Pushing table schemas

[Section titled Pushing table schemas](https://docs.astro.build/en/guides/astro-db/#pushing-table-schemas)

Your table schema may change over time as your project grows. You can safely test configuration changes locally and push to your remote database when you deploy.

You can push your local schema changes to your remote database via the CLI using the `astro db push --remote` command:

-   [npm](https://docs.astro.build/en/guides/astro-db/#tab-panel-427)
-   [pnpm](https://docs.astro.build/en/guides/astro-db/#tab-panel-428)
-   [Yarn](https://docs.astro.build/en/guides/astro-db/#tab-panel-429)

Terminal window

```
npm run astro db push --remote
```

This command will verify that your local changes can be made without data loss and, if necessary, suggest how to safely make changes to your schema in order to resolve conflicts.

#### Pushing breaking schema changes

[Section titled Pushing breaking schema changes](https://docs.astro.build/en/guides/astro-db/#pushing-breaking-schema-changes)

Caution

**This will destroy your database**. Only perform this command if you do not need your production data.

If you must change your table schema in a way that is incompatible with your existing data hosted on your remote database, you will need to reset your production database.

To push a table schema update that includes a breaking change, add the `--force-reset` flag to reset all production data:

-   [npm](https://docs.astro.build/en/guides/astro-db/#tab-panel-430)
-   [pnpm](https://docs.astro.build/en/guides/astro-db/#tab-panel-431)
-   [Yarn](https://docs.astro.build/en/guides/astro-db/#tab-panel-432)

Terminal window

```
npm run astro db push --remote --force-reset
```

### Renaming tables

[Section titled Renaming tables](https://docs.astro.build/en/guides/astro-db/#renaming-tables)

It is possible to rename a table after pushing your schema to your remote database.

If you **do not have any important production data**, then you can [reset your database](https://docs.astro.build/en/guides/astro-db/#pushing-breaking-schema-changes) using the `--force-reset` flag. This flag will drop all of the tables in the database and create new ones so that it matches your current schema exactly.

To rename a table while preserving your production data, you must perform a series of non-breaking changes to push your local schema to your remote database safely.

The following example renames a table from `Comment` to `Feedback`:

1.  In your database config file, add the `deprecated: true` property to the table you want to rename:

    db/config.ts

    ```
    const Comment = defineTable({  deprecated: true,  columns: {    author: column.text(),    body: column.text(),  }});
    ```

2.  Add a new table schema (matching the existing table's properties exactly) with the new name:

    db/config.ts

    ```
    const Comment = defineTable({  deprecated: true,  columns: {    author: column.text(),    body: column.text(),  }});const Feedback = defineTable({  columns: {    author: column.text(),    body: column.text(),  }});
    ```

3.  [Push to your remote database](https://docs.astro.build/en/guides/astro-db/#pushing-table-schemas) with `astro db push --remote`. This will add the new table and mark the old as deprecated.

4.  Update any of your local project code to use the new table instead of the old table. You might need to migrate data to the new table as well.

5.  Once you are confident that the old table is no longer used in your project, you can remove the schema from your `config.ts`:

    db/config.ts

    ```
    const Comment = defineTable({  deprecated: true,  columns: {    author: column.text(),    body: column.text(),  }});
    const Feedback = defineTable({  columns: {    author: column.text(),    body: column.text(),  }});
    ```

6.  Push to your remote database again with `astro db push --remote`. The old table will be dropped, leaving only the new, renamed table.

### Pushing table data

[Section titled Pushing table data](https://docs.astro.build/en/guides/astro-db/#pushing-table-data)

You may need to push data to your remote database for seeding or data migrations. You can author a `.ts` file with the `astro:db` module to write type-safe queries. Then, execute the file against your remote database using the command `astro db execute <file-path> --remote`:

The following Comments can be seeded using the command `astro db execute db/seed.ts --remote`:

db/seed.ts

```
import { Comment } from 'astro:db';
export default async function () {  await db.insert(Comment).values([    { authorId: 1, body: 'Hope you like Astro DB!' },    { authorId: 2, body: 'Enjoy!' },  ])}
```

See the [CLI reference](https://docs.astro.build/en/guides/integrations-guide/db/#astro-db-cli-reference) for a complete list of commands.

Building Astro DB integrations
------------------------------

[Section titled Building Astro DB integrations](https://docs.astro.build/en/guides/astro-db/#building-astro-db-integrations)

[Astro integrations](https://docs.astro.build/en/reference/integrations-reference/) can extend user projects with additional Astro DB tables and seed data.

Use the `extendDb()` method in the `astro:db:setup` hook to register additional Astro DB config and seed files. The `defineDbIntegration()` helper provides TypeScript support and auto-complete for the `astro:db:setup` hook.

my-integration/index.ts

```
import { defineDbIntegration } from '@astrojs/db/utils';
export default function MyIntegration() {  return defineDbIntegration({    name: 'my-astro-db-powered-integration',    hooks: {      'astro:db:setup': ({ extendDb }) => {        extendDb({          configEntrypoint: '@astronaut/my-package/config',          seedEntrypoint: '@astronaut/my-package/seed',        });      },      // Other integration hooks...    },  });}
```

Integration [config](https://docs.astro.build/en/guides/astro-db/#define-your-database) and [seed](https://docs.astro.build/en/guides/astro-db/#seed-your-database-for-development) files follow the same format as their user-defined equivalents.

### Type safe operations in integrations

[Section titled Type safe operations in integrations](https://docs.astro.build/en/guides/astro-db/#type-safe-operations-in-integrations)

While working on integrations, you may not be able to benefit from Astro's generated table types exported from `astro:db`. For full type safety, use the `asDrizzleTable()` utility to create a table reference object you can use for database operations.

For example, given an integration setting up the following `Pets` database table:

my-integration/config.ts

```
import { defineDb, defineTable, column } from 'astro:db';
export const Pets = defineTable({  columns: {    name: column.text(),    species: column.text(),  },});
export default defineDb({ tables: { Pets } });
```

The seed file can import `Pets` and use `asDrizzleTable()` to insert rows into your table with type checking:

my-integration/seed.ts

```
import { asDrizzleTable } from '@astrojs/db/utils';import { db } from 'astro:db';import { Pets } from './config';
export default async function() {  const typeSafePets = asDrizzleTable('Pets', Pets);
  await db.insert(typeSafePets).values([    { name: 'Palomita', species: 'cat' },    { name: 'Pan', species: 'dog' },  ]);}
```

The value returned by `asDrizzleTable('Pets', Pets)` is equivalent to `import { Pets } from 'astro:db'`, but is available even when Astro's type generation can't run. You can use it in any integration code that needs to query or insert into the database.

Migrate from Astro Studio to Turso
----------------------------------

[Section titled Migrate from Astro Studio to Turso](https://docs.astro.build/en/guides/astro-db/#migrate-from-astro-studio-to-turso)

1.  In the [Studio dashboard](https://studio.astro.build/), navigate to the project you wish to migrate. In the settings tab, use the "Export Database" button to download a dump of your database.
2.  Follow the official instructions to [install the Turso CLI](https://docs.turso.tech/cli/installation) and [sign up or log in](https://docs.turso.tech/cli/authentication) to your Turso account.
3.  Create a new database on Turso using the `turso db create` command.

    Terminal window

    ```
    turso db create [database-name]
    ```

4.  Fetch the database URL using the Turso CLI, and use it as the environment variable `ASTRO_DB_REMOTE_URL`.

    Terminal window

    ```
    turso db show [database-name]
    ```

    ```
    ASTRO_DB_REMOTE_URL=[your-database-url]
    ```

5.  Create a token to access your database, and use it as the environment variable `ASTRO_DB_APP_TOKEN`.

    Terminal window

    ```
    turso db tokens create [database-name]
    ```

    ```
    ASTRO_DB_APP_TOKEN=[your-app-token]
    ```

6.  Push your DB schema and metadata to the new Turso database.

    Terminal window

    ```
    astro db push --remote
    ```

7.  Import the database dump from step 1 into your new Turso DB.

    Terminal window

    ```
    turso db shell [database-name] < ./path/to/dump.sql
    ```

8.  Once you have confirmed your project connects to the new database, you can safely delete the project from Astro Studio.

[Edit page](https://github.com/withastro/docs/edit/main/src/content/docs/en/guides/astro-db.mdx)