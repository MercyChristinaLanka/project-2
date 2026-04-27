const http = require('http');

const server = http.createServer((req, res) => {
  res.end("Hello DevSecOps Pipeline Running");
});

server.listen(3000, () => {
  console.log("App running on port 3000");
});
