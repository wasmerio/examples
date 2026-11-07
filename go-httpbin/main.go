// Serve the unchanged upstream HTTP testing app with bounded public defaults.
package main

import (
	"log"
	"net"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/mccutchen/go-httpbin/v2/httpbin"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	redirectHosts := os.Getenv("ALLOWED_REDIRECT_DOMAINS")
	if redirectHosts == "" {
		redirectHosts = "example.com"
	}
	app := httpbin.New(
		httpbin.WithAllowedRedirectDomains(strings.Split(redirectHosts, ",")),
		httpbin.WithExcludeHeaders("authorization,cookie"),
	)
	server := &http.Server{
		Addr:              net.JoinHostPort("0.0.0.0", port),
		Handler:           app,
		ReadHeaderTimeout: 5 * time.Second,
	}
	log.Printf("go-httpbin v2.25.0 listening on %s", server.Addr)
	log.Fatal(server.ListenAndServe())
}
