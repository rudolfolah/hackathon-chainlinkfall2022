import * as http from "http";

const server = new http.Server();

server.on("request", (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.searchParams.has("a")) {
    res.end("-1");
    return;
  }
  const address = url.searchParams.get("a");
  const riskScore = 0;
  res.end(JSON.stringify({ riskScore }));
});

server.listen({
  host: "0.0.0.0",
  port: 8080
});
