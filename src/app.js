const fs = require("fs");
let allComments = require("../comments.json");

const send = (res, content, statusCode = 200) => {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

const simplifyIntoObject = function(content) {
  let splittedData = content.split("&");

  let name = splittedData[0].split("=")[1];

  let userComment = splittedData[1].split("=")[1];
  let comment = userComment.replace(/\+/g, " ");

  let date = new Date().toString();
  let time = date.slice(0, date.search("GMT"));

  let timeId = Date.now();

  return {
    name,
    comment,
    time,
    timeId
  };
};

const withTags = function(tag, content) {
  return ["<", tag, ">", content, "<", "/", tag, ">"].join("");
};

const makeTableRow = function(time, name, comment) {
  let timeTd = withTags("td", time);
  let nameTd = withTags("td", name);
  let commentTd = withTags("td", comment);
  return withTags("tr", timeTd + nameTd + commentTd);
};

const generateTableForComments = function(comments) {
  let commentsTable = "";
  for (let counter = 0; counter < comments.length; counter++) {
    commentsTable += makeTableRow(
      comments[counter].time,
      comments[counter].name,
      comments[counter].comment
    );
  }

  return withTags("table", commentsTable);
};

const refreshGuestBook = function(req, res) {
  fs.readFile("./guestBook.html", (err, content) => {
    content += generateTableForComments(allComments);
    send(res, content);
  });
};

const serveRequestedFile = function(url) {
  if (url == "/") {
    return "./homepage.html";
  }
  if (url == "/guestBook.html") {
    return "./guestBook.html";
  }
  return "." + url;
};

const app = (req, res) => {
  let requestedUrl = serveRequestedFile(req.url);

  if (req.url == "/guestBook.html" && req.method == "POST") {
    let content = "";

    req.on("data", chunk => {
      content += chunk;
    });

    req.on("end", () => {
      let comment = simplifyIntoObject(content);
      allComments.unshift(comment);
      fs.writeFile("./comments.json", JSON.stringify(allComments), err => {
        console.log(err);
      });
      refreshGuestBook(req, res);
    });
    return;
  }

  if (req.url == "/guestBook.html" && req.method == "GET") {
    refreshGuestBook(req, res);
    return;
  }

  fs.exists(requestedUrl, exists => {
    if (exists) {
      fs.readFile(requestedUrl, (err, content) => {
        send(res, content);
      });
    } else {
      send(res, requestedUrl + " Not Found", 404);
    }
  });
};

module.exports = app;
