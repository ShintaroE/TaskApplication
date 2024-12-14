from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify([
        {"id": 1, "text": "Learn Docker", "completed": False},
        {"id": 2, "text": "Build Flask API", "completed": True},
    ])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
