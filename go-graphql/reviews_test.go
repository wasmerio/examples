package starwars

import (
	"fmt"
	"sync"
	"testing"

	"github.com/99designs/gqlgen/client"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/stretchr/testify/require"

	"github.com/wasmerio/shipit/examples/go-graphql/generated"
)

// Concurrent createReview calls must not race, and the stored list stays bounded.
func TestConcurrentReviewsAreBounded(t *testing.T) {
	srv := handler.New(generated.NewExecutableSchema(NewResolver()))
	srv.AddTransport(transport.POST{})
	c := client.New(srv)

	const writers = maxReviewsPerEpisode + 20
	var wg sync.WaitGroup
	for i := range writers {
		wg.Add(1)
		go func() {
			defer wg.Done()
			var resp struct{ CreateReview struct{ Stars int } }
			c.MustPost(fmt.Sprintf(`mutation { createReview(episode: JEDI, review: {stars: %d}) { stars } }`, i%5+1), &resp)
		}()
	}
	wg.Wait()

	var resp struct{ Reviews []struct{ Stars int } }
	c.MustPost(`{ reviews(episode: JEDI) { stars } }`, &resp)
	require.Len(t, resp.Reviews, maxReviewsPerEpisode)
}
