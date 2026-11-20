package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	starwars "github.com/wasmerio/shipit/examples/go-graphql"
	"github.com/wasmerio/shipit/examples/go-graphql/generated"
)

const defaultPort = "8080"

// exampleQuery opens in the sandbox so the first visit can run a real query.
const exampleQuery = `query HeroAndFriends {
  hero(episode: EMPIRE) {
    name
    friends {
      name
    }
  }
}`

func main() {
	srv := handler.New(generated.NewExecutableSchema(starwars.NewResolver()))
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})
	srv.Use(extension.Introspection{})

	http.Handle("/", playground.ApolloSandboxHandler("Star Wars GraphQL", "/query",
		playground.WithApolloSandboxInitialStateDocument(exampleQuery)))
	http.Handle("/query", allowCORS(srv))

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}
	log.Printf("GraphQL server listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

// allowCORS lets the Apollo Sandbox, which runs on Apollo's domain, call this
// public read-only API. Restrict the origin before exposing private data.
func allowCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h := w.Header()
		h.Set("Access-Control-Allow-Origin", "*")
		h.Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		h.Set("Access-Control-Allow-Headers", "Content-Type, Apollo-Require-Preflight")
		next.ServeHTTP(w, r)
	})
}
