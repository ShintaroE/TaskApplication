from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify([
        {"id": 1, "title": "Learn Docker", "completed": False},
        {"id": 2, "title": "Build Flask API", "completed": True},
    ])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
