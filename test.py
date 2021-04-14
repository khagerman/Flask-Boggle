from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):
    def test_get_board(self):
        with app.test_client() as client:
            res = client.get("/")
            html = res.get_data(as_text=True)
            self.assertEqual(res.status_code, 200)
            self.assertIn("<h1>Boggle!</h1>", html)

    def test_check_word(self):
        with app.test_client() as client:
            client.get("/")
            res = client.get("/checkword?word=abaciscus")
            self.assertEqual(res.json["result"], "not-on-board")

    def test_session(self):
        """test to see if score is being stored in session"""
        with app.test_client() as client:
            res = client.post("/savescore", json={"score": 10})
            client.get("/")
            self.assertEqual(session["highscore"], 10)
