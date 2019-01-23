const fs = require("fs");
const allComments = require("../comments.json");

const {
  createCommentHTML,
  createCommentObject
} = require("./createCommentHtml");

const guestBook = fs.readFileSync("./public/guestBook.html", "utf-8");
const BEFORELOGIN = fs.readFileSync("./src/beforeLogin.html", "utf-8");
const AFTERLOGIN = fs.readFileSync("./src/afterLogin.html", "utf-8");

const send = (res, content, statusCode = 200) => {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
  return;
};

const logRequest = function(req, res, next) {
  console.log(req.url, req.method);
  next();
};

const refreshGuestBook = function(req, res) {
  let data = guestBook.replace(
    "###COMMENTS###",
    createCommentHTML(allComments)
  );

  if (req.cookies.username) {
    let content = data.replace("##LOGGING##", AFTERLOGIN);
    send(res, content.replace("###USER###", req.cookies.username));
    return;
  }
  send(res, data.replace("##LOGGING##", BEFORELOGIN));
  return;
};

const getUrl = function(url) {
  if (url == "/") {
    return "./public/homepage.html";
  }
  return "./public" + url;
};

const renderBody = function(req, res, next) {
  let requestedUrl = getUrl(req.url);
  fs.readFile(requestedUrl, (err, content) => {
    if (err) {
      return send(res, "Not Found", 404);
    }
    send(res, content);
    next();
  });
};

const renderForm = function(req, res) {
  let content = "";
  req.on("data", chunk => {
    content += chunk;
  });

  req.on("end", () => {
    let comment = createCommentObject(req.cookies.username, content);
    allComments.unshift(comment);
    let data = JSON.stringify(allComments);
    res.writeHead(302, {
      Location: "/guestBook.html"
    });
    res.end();
    fs.writeFile("./comments.json", data, err => {
      console.log(err);
    });
  });

  return;
};

const renderRefreshComments = function(req, res, next) {
  let data = createCommentHTML(allComments);
  send(res, data);
  return;
};

const loadCookies = function(req, res, next) {
  let cookie = req.headers["cookie"];
  let cookies = {};
  if (cookie) {
    cookie.split(";").forEach(element => {
      let [name, value] = element.split("=");
      cookies[name] = value;
    });
  }
  req.cookies = cookies;
  next();
};

const login = function(req, res, next) {
  let content = "";
  req.on("data", chunk => (content += chunk));
  req.on("end", () => {
    let username = content.split("=")[1];
    res.setHeader("Set-Cookie", "username=" + username);

    res.writeHead(302, {
      Location: "/guestBook.html"
    });
    res.end();
  });
};

const logout = function(req, res, next) {
  res.setHeader(
    "Set-Cookie",
    "username=;expires=Thu, 01 Jan 1970 00:00:00 UTC"
  );
  res.writeHead(302, {
    Location: "/guestBook.html"
  });
  res.end();
};

module.exports = {
  refreshGuestBook,
  renderForm,
  renderBody,
  logRequest,
  renderRefreshComments,
  login,
  logout,
  loadCookies
};
