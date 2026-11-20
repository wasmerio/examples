# Star Wars GraphQL API with Go on Wasmer

A GraphQL server written in Go with [gqlgen](https://gqlgen.com). It serves the Star Wars schema from gqlgen's own example and opens GraphiQL in the browser, so you can explore the API and run queries straight away.

## Demo

Deploy your own copy and open its URL. GraphiQL loads with the Explorer panel: click fields such as `hero → name` and `friends` to build a query, then press **Run**. Or paste:

```graphql
{
  hero(episode: EMPIRE) {
    name
    friends { name }
  }
  search(text: "an") {
    __typename
    ... on Human { name height }
    ... on Starship { name length }
  }
}
```

The schema shows connections, unions, interfaces and enums. Data is in memory, so it resets when the app restarts.

## How it works

- `schema.graphql` defines the API; `gqlgen` generates `generated/` and `models/` from it (`.gqlgen.yml`).
- `resolvers.go` answers queries from in-memory Star Wars data.
- `server/server.go` serves GraphiQL at `/` and the API at `/query` (GET and POST), and listens on `PORT`, defaulting to `8080`.

No database, API key or persistent volume is required.

## Running locally

Use Go 1.25 or newer:

```bash
cd go-graphql
go run ./server
```

Open <http://localhost:8080/>. Run the tests with `go test ./...`.

To change the API, edit `schema.graphql`, run `go run github.com/99designs/gqlgen generate`, then update `resolvers.go`.

## Deploying to Wasmer

1. Import `https://github.com/wasmerio/examples` in Wasmer and set the root directory to `go-graphql`, or upload the contents of this directory as a folder.
2. Keep the detected Go preset. This example needs no database or secrets.
3. Deploy and open the resulting app URL.

From the CLI:

```bash
cd go-graphql
wasmer deploy --build-remote
```
