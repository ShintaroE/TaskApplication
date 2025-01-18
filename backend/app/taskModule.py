from sqlalchemy.sql import text
from sqlalchemy.exc import SQLAlchemyError
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def get_next_task_id():
    try:
        sql = text('SELECT nextval(\'tasks_id_seq\') as id')
        with db.session.begin():
            result = db.session.execute(sql)
            return {"id": result.fetchone().id, "success": True}
    except SQLAlchemyError as e:
        return {"error": f"データベースエラー: {str(e)}", "success": False, "status_code": 500}
    except Exception as e:
        return {"error": f"予期しないエラー: {str(e)}", "success": False, "status_code": 500}

def get_all_tasks():
    try:
        sql = text('SELECT id, task, completed FROM tasks ORDER BY id')
        with db.session.begin():
            result = db.session.execute(sql)
            tasks = [{"id": row.id, "text": row.task, "completed": row.completed} for row in result]
        return {"tasks": tasks, "success": True}
    except SQLAlchemyError as e:
        return {"error": f"データベースエラー: {str(e)}", "success": False, "status_code": 500}
    except Exception as e:
        return {"error": f"予期しないエラー: {str(e)}", "success": False, "status_code": 500}

def add_task_to_db(task_text):
    try:
        sql = text('SELECT nextval(\'tasks_id_seq\') as id')
        with db.session.begin():
            result = db.session.execute(sql)
        task_id = result.fetchone().id

        sql = text('INSERT INTO tasks (id, task, completed) VALUES (:id, :text, :completed)')
        params = {'id': task_id, 'text': task_text, 'completed': False}
        with db.session.begin():
            db.session.execute(sql, params)
            db.session.commit()
        return {"message": "タスクが追加されました", "success": True, "id": task_id}
    except SQLAlchemyError as e:
        return {"error": f"データベースエラー: {str(e)}", "success": False, "status_code": 500}
    except Exception as e:
        return {"error": f"予期しないエラー: {str(e)}", "success": False, "status_code": 500}

def update_task_condition(task_id, condition):
    try:
        sql = text('UPDATE tasks SET completed = :completed WHERE id = :id')
        params = {'completed': condition, 'id': task_id}
        with db.session.begin():
            db.session.execute(sql, params)
            db.session.commit()
        return {"message": "状態を変更しました", "success": True, "id": task_id}
    except SQLAlchemyError as e:
        return {"error": f"データベースエラー: {str(e)}", "success": False, "status_code": 500}
    except Exception as e:
        return {"error": f"予期しないエラー: {str(e)}", "success": False, "status_code": 500}

def delete_task_from_db(task_id):
    try:
        sql = text('DELETE FROM tasks WHERE id = :id')
        params = {'id': task_id}
        with db.session.begin():
            db.session.execute(sql, params)
            db.session.commit()
        return {"message": "タスクが削除されました", "success": True, "id": task_id}
    except SQLAlchemyError as e:
        return {"error": f"データベースエラー: {str(e)}", "success": False, "status_code": 500}
    except Exception as e:
        return {"error": f"予期しないエラー: {str(e)}", "success": False, "status_code": 500}
