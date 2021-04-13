async function checkUserWord(e) {
  console.log("checkUserWord executed from the submit event listener!");
  e.preventDefault();
  const word = $("#submitword input").val();
  console.log(word);
  if (word.length === 0) {
    return;
  }
  const res = await axios.get("/checkword", { params: { word: word } });
  if (res.data.response === "ok") {
    $("#notify").show().addClass("alert alert-success").text("Correct!");
  }
  $("#submitword input").val("");
}
$("#submitword").on("submit", checkUserWord);
