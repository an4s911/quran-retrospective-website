#!.venv/bin/python

import json
import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

# So it supports Cross-origin stuff in javascript.
# If this isn't here, then there is an error when using localhost
CORS(app)

load_dotenv()

try:
    data_file = open('data.json')
except FileNotFoundError:
    data = {}
    with open('data.json', 'w') as data_file:
        json.dump(data, data_file)
else:
    data = json.load(data_file)
    data_file.close()
    # Data's Format:
    # {
    #     "2022/02/12": [
    #         {
    #             "text": "1hp17",
    #             "plusStage": 2,
    #             "done": False,
    #         },
    #         {
    #             "text": "3qh2",
    #             "plusStage": -1,
    #             "done": True,
    #         },
    #         {
    #             "text": "1qh2",
    #             "plusStage": -1,
    #             "done": False,
    #         },
    #     ]
    # }


@app.route("/api/getlist", methods=['POST'])
def getlist():
    global data
    with open('data.json') as data_file:
        data = json.load(data_file)
        return jsonify(data)


@app.route('/api/updatedata', methods=["POST"])
def updateData():
    global data
    try:
        temp_data = request.json
    except Exception:
        return jsonify(success=False), 400
    else:
        secret_key = temp_data.pop('secret_key')
        if secret_key == os.getenv('SECRET_KEY'):
            data = temp_data
            with open('data.json', 'w') as data_file:
                json.dump(data, data_file)
            return jsonify(success=True), 200
        else:
            return jsonify(success=False), 403


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)
