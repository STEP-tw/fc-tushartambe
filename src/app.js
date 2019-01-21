const fs = require("fs");
const {
  generateTableForComments,
  simplifyIntoObject
} = require("./createTable");

let allComments = require("../comments.json");

const send = (res, content, statusCode = 200) => {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
  return;
};

const refreshGuestBook = function(req, res) {
  fs.readFile("./guestBook.html", (err, content) => {
    content += generateTableForComments(allComments);
    send(res, content);
  });
};

const getUrl = function(url) {
  if (url == "/") {
    return "./homepage.html";
  }
  return "." + url;
};

const renderBody = function(req, res) {
  let requestedUrl = getUrl(req.url);
  fs.readFile(requestedUrl, (err, content) => {
    if (err) {
      send(res, "Not Found", 404);
      return;
    }
    send(res, content);
  });
  return;
};

const isMatchingRoute = (req, route) => {
  if (route.handler && !(route.method || route.url)) return true;
  if (route.method == req.method && route.url == req.url) return true;
  return false;
};

class CreateApp {
  constructor() {
    this.routes = [];
  }

  handler(req, res) {
    let matchingRoutes = this.routes.filter(isMatchingRoute.bind(req));
    let next = () => {
      let current = matchingRoutes[0];
      if (!current) {
        return;
      }
      matchingRoutes.shift();
      current.handler(req, res, next);
    };
    next();
  }

  use(handler) {
    this.routes.push({ handler });
  }
  get(url, handler) {
    this.routes.push({ url, method: "GET", handler });
  }
  post(url, handler) {
    this.routes.push({ url, method: "POST", handler });
  }
}

const renderForm = function(req, res) {
  let content = "";
  req.on("data", chunk => {
    content += chunk;
  });

  req.on("end", () => {
    let comment = simplifyIntoObject(content);
    allComments.unshift(comment);
    refreshGuestBook(req, res);
    fs.writeFile("./comments.json", JSON.stringify(allComments), err => {
      console.log(err);
    });
  });
  return;
};

const app = new CreateApp();
const requestHandler = app.handler.bind(app);
app.use(renderBody);
app.post("/guestBook.html", renderForm);

module.exports = requestHandler;
