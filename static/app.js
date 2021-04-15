class BoggleGame {
  constructor(count = 60) {
    this.score = 0;
    this.count = count;
    this.words = [];
    this.board = $(".board");
    $("#submitword", this.board).on("submit", this.checkUserWord.bind(this));
    this.counter = setInterval(this.timer.bind(this), 1000);
  }
  async checkUserWord(e) {
    e.preventDefault();
    if (this.words.length === 0) {
      this.timer();
    }
    const word = $("#submitword input").val().toLowerCase();
    console.log(word);
    if (word.length === 0) {
      return;
    }
    if (this.words.includes(word)) {
      alertUser("alert-info", "Oops, you already found that!");
      this.hide();
      return;
    }

    const res = await axios.get("/checkword", { params: { word: word } });
    console.log(res);
    if (res.data.result === "ok") {
      this.alertUser("alert-success", "Correct!! Nice Job!");
      this.words.push(word);
      this.keepScore(word);
      this.hide();
    } else if (res.data.result === "not-on-board") {
      this.alertUser("alert-warning", "That is a word, but it's not on board!");
      this.hide();
    } else {
      alertUser("alert-danger", "That's not a word in our dictionary :(");
      this.hide();
    }
    $("#submitword input").val("");
  }

  keepScore(word) {
    this.score += word.length;
    $("#points").text(this.score);
  }

  hide() {
    setTimeout(() => {
      $("#notify").hide();
      $("#notify").removeClass("alert alert-danger");
      $("#notify").removeClass("alert alert-warning");
      $("#notify").removeClass("alert alert-success");
      $("#notify").removeClass("alert alert-info");
    }, 3000);
  }

  timer() {
    this.count = this.count - 1;
    if (this.count <= 0) {
      $("#timer").html("time's up!");
      clearInterval(this.counter);
      $("input").prop("disabled", true);
      this.finishGame();
      return;
    }
    $("#timer").html(this.count);
  }
  alertUser(type, message) {
    $("#notify").show().addClass(`alert ${type}`).html(`<h2>${message}<h2>`);
  }

  async finishGame() {
    const res = await axios.post("/savescore", { score: score });
    if (res.data.bestscore) {
      this.alertUser(
        "alert-success",
        `Yah! Congrats new top score of ${score} points !!!!`
      );
    } else {
      this.alertUser("alert-info", `Nice Job, you scored ${score} points`);
    }
    $("#restart").show();
  }
}
