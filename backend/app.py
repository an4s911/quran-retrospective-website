#!.venv/bin/python

from datetime import datetime, timedelta
from flask import Flask, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)


@app.route("/api/getlist", methods=['POST'])
def getlist():
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
    #     ],
    # }
    date = datetime(year=2022, month=2, day=13)
    data = {}
    for _ in range(100):
        curr_data = []
        for i in range(3):
            temp_data = {}
            temp_data['text'] = '1hp17'
            temp_data['plusStage'] = -1
            temp_data['done'] = True
            curr_data.append(temp_data)
        date_formated = date.strftime('%Y/%m/%d')
        data[date_formated] = curr_data
        date += timedelta(days=1)

    return jsonify(data)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)
