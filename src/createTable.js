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

module.exports = {
  generateTableForComments,
  makeTableRow,
  simplifyIntoObject
};
