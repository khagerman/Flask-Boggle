async function checkUserWord(e) {
  e.preventDefault();
  const word = $("#submitword").val();
  if (word.length === 0) {
    return;
  }
  const res = axios.get("/checkword", { params: { word: word } });
}
// $("#submitword").on("submit", checkUserWord);
