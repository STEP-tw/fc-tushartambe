const Framework = require("./framework");
const app = new Framework();
const {
  refreshGuestBook,
  renderForm,
  renderBody,
  logRequest,
  renderRefreshComments,
  login,
  logout,
  loadCookies
} = require("./appHelpers");

app.use(logRequest);
app.use(loadCookies);
app.get("/guestBook.html", refreshGuestBook);
app.get("/comments", renderRefreshComments);
app.post("/login", login);
app.post("/logout", logout);
app.post("/sendComment", renderForm);
app.use(renderBody);

module.exports = app.handler.bind(app);
