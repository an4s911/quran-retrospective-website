#!.venv/bin/python

import random

from datetime import datetime, timedelta
from flask import Flask, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

date = datetime(year=2022, month=2, day=13)
data = {}
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
plus_states = [-1, 0, 1, 3]
for _ in range(100):
    curr_data = []
    for i in range(3):
        temp_data = {}
        temp_data['text'] = f'{random.randint(1, 4)}qh{random.randint(1, 60)}'
        temp_data['plusStage'] = random.choice(plus_states)
        temp_data['done'] = bool(random.getrandbits(1))
        curr_data.append(temp_data)
    date_formated = date.strftime('%Y/%m/%d')
    data[date_formated] = curr_data
    date += timedelta(days=1)


@app.route("/api/getlist", methods=['POST'])
def getlist():
    global data
    return jsonify(data)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)
