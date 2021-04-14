from flask import (
    Flask,
    request,
    render_template,
    redirect,
    flash,
    session,
    jsonify,
)
from flask_debugtoolbar import DebugToolbarExtension

from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "oh-so-secret"
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False

debug = DebugToolbarExtension(app)

boggle_game = Boggle()


@app.route("/")
def get_boggle_board():
    """Create board and show html """
    board = boggle_game.make_board()
    session["board"] = board
    return render_template("board.html", board=board)


@app.route("/checkword")
def check_valid_word():
    """Check if word is in dictionary."""
    user_word = request.args.get("word", "")
    board = session["board"]
    res = boggle_game.check_valid_word(board, user_word)
    return jsonify({"result": res})


@app.route("/savescore", methods=["POST"])
def get_score():
    """Save score and number of plays. See if current score is better than previous high score"""
    score = request.json.get("score", 0)
    highscore = session.get("highscore", 0)
    games_played = session.get("games_played", 0)
    session["highscore"] = max(score, highscore)
    session["games_played"] = games_played + 1
    return jsonify(bestscore=score > highscore)
