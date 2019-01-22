const refreshComments = function() {
  fetch("/comments").then(response =>
    response.text().then(text => {
      document.getElementById("comments_section").innerHTML = text;
    })
  );
};

window.onload = function() {
  document.getElementById("refresh").onclick = refreshComments;
};
