#!.venv/bin/python

from operator import methodcaller
from flask import Flask, jsonify, render_template
from flask_cors import CORS
app = Flask(__name__, template_folder="../test")
CORS(app)


@app.route("/api/getlist", methods=['POST'])
def getlist():
    data = {
        "Sun, 12 Feb": [
            {
                "text": "1hp17",
                "plusStage": 2,
                "done": False,
            },
            {
                "text": "3qh2",
                "plusStage": -1,
                "done": True,
            },
            {
                "text": "1qh2",
                "plusStage": -1,
                "done": False,
            },
        ],

        "Mon, 13 Feb": [
            {
                "text": "2qh2",
                "plusStage": 0,
                "done": True,
            },
            {
                "text": "3qh1",
                "plusStage": -1,
                "done": False,
            },
            {
                "text": "1qh3",
                "plusStage": -1,
                "done": False,
            },
        ],
    }

    return jsonify(data)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)
