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

const app = (req, res) => {
  try {
    if (req.url == "/") {
      html.homePage(req, res);
    } else {
      fs.exists("." + req.url, exists => {
        if (exists) {
          fs.readFile("." + req.url, (err, content) => {
            res.write(content);
            res.end();
          });
        } else {
          res.end();
        }
      });
    }
  } catch (err) {}
};

// Export a function that can act as a handler

module.exports = app;
