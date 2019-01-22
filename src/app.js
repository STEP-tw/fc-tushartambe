const Framework = require("./framework");
const app = new Framework();
const {
  refreshGuestBook,
  renderForm,
  renderBody,
  logRequest,
  renderRefreshComments
} = require("./appHelpers");

app.use(logRequest);
app.get("/guestBook.html", refreshGuestBook);
app.get("/comments", renderRefreshComments);
app.post("/guestBook.html", renderForm);
app.use(renderBody);

module.exports = app.handler.bind(app);
