from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text
from sqlalchemy.exc import SQLAlchemyError
import os

app = Flask(__name__)
CORS(app)

# データベースの設定
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://user:password@db:5432/taskdb')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
    
# シーケンスから次のidを取得する
@app.route('/api/getid', methods=['GET'])
def get_next_val():
    try:
        print("シーケンスの採番")
        sql = text('SELECT nextval(\'tasks_id_seq\') as id')
        with db.session.begin():  # セッションを自動管理
            result = db.session.execute(sql)
            tasks = {"id": result.fetchone().id}
        return jsonify(tasks)
    except SQLAlchemyError as e:
        print(f"SQLAlchemyエラー: {str(e)}")
        return jsonify({"error": "データベースエラーが発生しました"}), 500
    except Exception as e:
        print(f"不明なエラー: {str(e)}")
        return jsonify({"error": "予期しないエラーが発生しました"}), 500

# データベースから全タスクを取得するエンドポイント
@app.route('/api/gettasks', methods=['GET'])
def get_all_tasks():
    try:
        print("DB検索の開始")
        sql = text('SELECT id, task, completed FROM tasks ORDER BY id')
        with db.session.begin():  # セッションを自動管理
            result = db.session.execute(sql)
            tasks = [{"id": row.id, "text": row.task, "completed": row.completed} for row in result]
        return jsonify(tasks)
    except SQLAlchemyError as e:
        print(f"SQLAlchemyエラー: {str(e)}")
        return jsonify({"error": "データベースエラーが発生しました"}), 500
    except Exception as e:
        print(f"不明なエラー: {str(e)}")
        return jsonify({"error": "予期しないエラーが発生しました"}), 500
    
# 新しいタスクを追加するエンドポイント
@app.route('/api/addtask', methods=['POST'])
def add_task():
    try:
        # シーケンスから次のidを取得
        print("シーケンスの採番")
        sql = text('SELECT nextval(\'tasks_id_seq\') as id')
        with db.session.begin():  # セッションを自動管理
            result = db.session.execute(sql)
        id = result.fetchone().id

        # タスクを追加
        print("DB登録の開始")
        data = request.get_json()
        if not data or not 'text' in data:
            return jsonify({"error": "無効なデータ"}), 400
        
        print("SQLの実行")
        sql = text('INSERT INTO tasks (id ,task, completed) VALUES (:id , :text, :completed)')
        params = {'id': id , 'text': data['text'], 'completed': False}
        with db.session.begin():  # セッションを自動管理
            db.session.execute(sql, params)
            db.session.commit()
        return jsonify({"message": "タスクが追加されました" , "success": True , "id": id}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"SQLAlchemyエラー: {str(e)}")
        return jsonify({"error": "データベースエラーが発生しました" , "success": False}), 500
    except Exception as e:
        db.session.rollback()
        print(f"不明なエラー: {str(e)}")
        return jsonify({"error": "予期しないエラーが発生しました" , "success": False}), 500
    
# データベースのタスクを更新するエンドポイント
@app.route('/api/changetaskcondition', methods=['POST'])
def change_task_condition():
    try:
        print("DB検索の開始")
        data = request.get_json() # リクエストデータを取得
        if not data or not 'condition' in data or not 'id' in data:
            return jsonify({"error": "無効なデータ"}), 400
        sql = text('UPDATE tasks SET completed = :completed WHERE id = :id')
        params = {'completed': data['condition'], 'id': data['id']}
        with db.session.begin():  # セッションを自動管理
            db.session.execute(sql , params)
            db.session.commit()
        return jsonify({"message": "状態を変更しました" , "success": True , "id": data['id']}), 201
    except SQLAlchemyError as e:
        print(f"SQLAlchemyエラー: {str(e)}")
        return jsonify({"error": "データベースエラーが発生しました"}), 500
    except Exception as e:
        print(f"不明なエラー: {str(e)}")
        return jsonify({"error": "予期しないエラーが発生しました"}), 500

# データベースのタスクを削除するエンドポイント
@app.route('/api/deletetask', methods=['POST'])
def delete_task():
    try:
        print("DB検索の開始")
        data = request.get_json() # リクエストデータを取得
        if not data or not 'id' in data:
            return jsonify({"error": "無効なデータ"}), 400
        sql = text('DELETE FROM tasks WHERE id = :id')
        params = {'id': data['id']}
        with db.session.begin():  # セッションを自動管理
            db.session.execute(sql , params)
            db.session.commit()
        return jsonify({"message": "状態を変更しました" , "success": True , "id": data['id']}), 201
    except SQLAlchemyError as e:
        print(f"SQLAlchemyエラー: {str(e)}")
        return jsonify({"error": "データベースエラーが発生しました"}), 500
    except Exception as e:
        print(f"不明なエラー: {str(e)}")
        return jsonify({"error": "予期しないエラーが発生しました"}), 500

if __name__ == '__main__':
    app.run(debug=True , host='0.0.0.0', port=8000)
