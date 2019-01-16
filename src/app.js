const fs = require("fs");
const html = {
  homePage: `<!DOCTYPE html>
  <html>
    <head>
      <title>Flower Catalog</title>
      <script src="main.js"></script>
      <style>
        .mainDiv {
          display: flex;
          flex-direction: column;
        }
        .imageAndLinks {
          display: flex;
        }
        .title {
          text-align: right;
          border-bottom: 1px solid black;
          margin: 10px;
        }
        .flowerImage {
          border: 1px solid black;
        }
      </style>
    </head>
    <body>
      <div id="main_div" class="mainDiv">
        <header id="title" class="title"><h1>Flower Catalog</h1></header>
        <div id="image_and_links" class="imageAndLinks">
          <div id="flower_image"><img src="https://raw.githubusercontent.com/tushartambe/imagesForHTML/master/freshorigins.jpg" alt="Flower" /></div>
          <div id="linksToPages">
            <ul>
              <li><a href="Abeliophyllum.html">Abeliophyllum</a></li>
              <li><a href="Ageratum.html">Ageratum</a></li>
            </ul>
  
            <img src="https://raw.githubusercontent.com/tushartambe/imagesForHTML/master/wateringJar.gif" alt="wateringJar" /> <br />
            <a href="guestBook.html">Guest Book</a>
          </div>
        </div>
      </div>
    </body>
  </html>
  `
};

const send = (res, content, statusCode = 200) => {
  res.statusCode = statusCode;
  res.write(content.toString());
  res.end();
};

const app = (req, res) => {
  try {
    if (req.url == "/") {
      send(res, html.homePage, 200);
    }
  } catch (err) {
  } finally {
    // res.statusCode = 404;
    res.end();
  }
};

// Export a function that can act as a handler

module.exports = app;
