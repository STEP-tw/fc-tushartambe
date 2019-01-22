const fs = require("fs");
const allComments = require("../comments.json");

const {
  createCommentHTML,
  createCommentObject
} = require("./createCommentHtml");

const guestBook = fs.readFileSync("./public/guestBook.html", "utf-8");

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
  fs.readFile("./public/guestBook.html", "utf8", (err, content) => {
    let data = content.replace(
      "###COMMENTS###",
      createCommentHTML(allComments)
    );
    send(res, data);
  });
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
    let comment = createCommentObject(content);
    allComments.unshift(comment);
    let data = JSON.stringify(allComments);
    refreshGuestBook(req, res);
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

module.exports = {
  refreshGuestBook: refreshGuestBook,
  renderForm,
  renderBody,
  logRequest,
  renderRefreshComments
};
