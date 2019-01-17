const fs = require("fs");

const html = {
  homePage: (req, res) => {
    fs.readFile("./src/homepage.html", (err, content) => {
      send(res, content, 200);
    });
  }
};

const send = (res, content, statusCode = 200) => {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

const getUrls = function(req) {
  if (req.url == "/") {
    return "./src/homepage.html";
  }
  return "." + req.url;
};

const app = (req, res) => {
  let fileUrl = getUrls(req);
  fs.exists(fileUrl, exists => {
    if (exists) {
      fs.readFile(fileUrl, (err, content) => {
        send(res, content);
      });
    } else {
      send(res, req.url + " Not Found", 404);
    }
  });
};

module.exports = app;
