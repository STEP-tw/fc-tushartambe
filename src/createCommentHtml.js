const createCommentObject = function(content) {
  const commentObject = new Object();
  const [, author, , commentText] = content.split(/=|&/);
  commentObject.name = author;
  commentObject.comment = commentText;
  commentObject.time = new Date();

  return commentObject;
};

const createCommentHTML = function(comments) {
  return comments
    .map(comment => {
      let date = new Date(comment.time).toLocaleString();
      return `<p>${date} &nbsp &nbsp &nbsp <strong>${
        comment.name
      }</strong> &nbsp &nbsp &nbsp ${comment.comment} </p>`;
    })
    .join("\n");
};

module.exports = {
  createCommentObject,
  createCommentHTML
};
