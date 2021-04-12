from flask import Flask, request, render_template, redirect, flash, session
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


@app.route("/checkword", methods=["GET", "POST"])
def check_valid_word():

    user_word = request.args["word"]
    board = session["board"]
    res = boggle_game.check_valid_word(board, user_word)
    return jsonify({"result": res})
