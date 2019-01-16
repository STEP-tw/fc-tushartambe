const http = require("http");
const app = require("./src/app.js");

// Do not change the port value
// If you want to use a different port
// set it as an environment variable.
const PORT = process.env.PORT || 8080;
// const PORT = 8011;

let server = http.createServer(app);
server.listen(PORT);
console.log("listening on ", PORT);
