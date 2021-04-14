let score = 0;
let count = 60;
let words = [];
let topScore = [];

async function checkUserWord(e) {
  e.preventDefault();
  timer();
  const word = $("#submitword input").val().toLowerCase();
  console.log(word);
  if (word.length === 0) {
    return;
  }
  if (words.includes(word)) {
    alertUser("alert-info", "Oops, you already found that!");
    hide();
    return;
  }

  const res = await axios.get("/checkword", { params: { word: word } });
  console.log(res);
  if (res.data.result === "ok") {
    alertUser("alert-success", "Correct!! Nice Job!");
    words.push(word);
    keepScore(word);
    hide();
  } else if (res.data.result === "not-on-board") {
    alertUser("alert-warning", "That is a word, but it's not on board!");

    hide();
  } else {
    alertUser("alert-danger", "That's not a word  in our dictionary :(");
    hide();
  }

  $("#submitword input").val("");
}
$("#submitword").on("submit", checkUserWord);

function keepScore(word) {
  score += word.length;
  $("#points").text(score);
}

function hide() {
  setTimeout(function () {
    $("#notify").hide();
    $("#notify").removeClass("alert alert-danger");
    $("#notify").removeClass("alert alert-warning");
    $("#notify").removeClass("alert alert-success");
    $("#notify").removeClass("alert alert-info");
  }, 3000);
}

let counter = setInterval(timer, 1000);

function timer() {
  count = count - 1;
  if (count <= 0) {
    $("#timer").html("time's up!");
    clearInterval(counter);
    $("input").prop("disabled", true);
    finishGame();
    return;
  }
  $("#timer").html(count);
}
function alertUser(type, message) {
  $("#notify").show().addClass(`alert ${type}`).html(`<h2>${message}<h2>`);
}

async function finishGame() {
  const res = await axios.post("/savescore", { score: score });
  if (res.data.bestscore) {
    alertUser(
      "alert-success",
      `Yah! Congrats new top score of ${score} points !!!!`
    );
  } else {
    alertUser("alert-info", `Nice Job, you scored ${score} points`);
  }
  $("#restart").show();
}
// function checkTopScore() {
//   let bestScore = Math.max(...topScore);
//   if (bestScore > score) {
//     alertUser("alert-success", "Yah! Congrats new top score!!!!");
//   }
// }
function restartGame() {
  location.reload();
}
$("#restart").on("click", restartGame);
