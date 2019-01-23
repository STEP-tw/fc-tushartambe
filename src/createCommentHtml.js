const createCommentObject = function(user, content) {
  const commentObject = new Object();
  const commentText = content.split(/=|&/)[1];
  commentObject.name = user;
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
