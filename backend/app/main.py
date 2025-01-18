from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from app.taskModule import (
    db,
    get_next_task_id,
    get_all_tasks,
    add_task_to_db,
    update_task_condition,
    delete_task_from_db
)

app = Flask(__name__)
CORS(app)

# Flask設定
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@db:5432/taskdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.route('/api/getid', methods=['GET'])
def get_next_val():
    result = get_next_task_id()
    if not result["success"]:
        return jsonify({"error": result["error"]}), result.get("status_code", 500)
    return jsonify(result)

@app.route('/api/gettasks', methods=['GET'])
def get_tasks():
    result = get_all_tasks()
    if not result["success"]:
        return jsonify({"error": result["error"]}), result.get("status_code", 500)
    return jsonify(result)

@app.route('/api/addtask', methods=['POST'])
def add_task():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "無効なデータ"}), 400
    result = add_task_to_db(data['text'])
    if not result["success"]:
        return jsonify({"error": result["error"]}), result.get("status_code", 500)
    return jsonify(result), 201

@app.route('/api/changetaskcondition', methods=['POST'])
def change_task_condition():
    data = request.get_json()
    if not data or 'condition' not in data or 'id' not in data:
        return jsonify({"error": "無効なデータ"}), 400
    result = update_task_condition(data['id'], data['condition'])
    if not result["success"]:
        return jsonify({"error": result["error"]}), result.get("status_code", 500)
    return jsonify(result), 201

@app.route('/api/deletetask', methods=['POST'])
def delete_task():
    data = request.get_json()
    if not data or 'id' not in data:
        return jsonify({"error": "無効なデータ"}), 400
    result = delete_task_from_db(data['id'])
    if not result["success"]:
        return jsonify({"error": result["error"]}), result.get("status_code", 500)
    return jsonify(result), 201

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
