async function checkUserWord(e) {
  console.log("checkUserWord executed from the submit event listener!");
  e.preventDefault();
  const word = $("#submitword input").val();
  console.log(word);
  if (word.length === 0) {
    return;
  }
  const res = await axios.get("/checkword", { params: { word: word } });
  console.log(res);
  if (res.data.result === "ok") {
    $("#notify")
      .show()
      .addClass("alert alert-success")
      .html(`<h2>Correct!<h2>`);
  } else if (res.data.result === "not-on-board") {
    $("#notify")
      .show()
      .addClass("alert alert-warning")
      .html(`<h2>That is a word, but it's not on board!<h2>`);
  } else {
    $("#notify")
      .show()
      .addClass("alert alert-danger")
      .html(`<h2>That's not a word :(<h2>`);
  }
  $("#submitword input").val("");
}
$("#submitword").on("submit", checkUserWord);
