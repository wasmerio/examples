const http = require("node:http");

const server = http.createServer((request, response) => {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  if (request.url !== "/") {
    response.writeHead(404);
    response.end(JSON.stringify({ error: "Route not found" }));
    return;
  }
  const configured = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USERNAME", "DB_PASSWORD"]
    .every((name) => Boolean(process.env[name]));
  response.writeHead(configured ? 200 : 503);
  response.end(JSON.stringify({ database: "postgresql", configured }));
});

if (require.main === module) {
  server.listen(Number(process.env.PORT || 8080), "0.0.0.0");
}

module.exports = server;
