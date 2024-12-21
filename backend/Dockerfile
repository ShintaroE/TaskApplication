FROM python:3.10-slim

WORKDIR /usr/src/app

# 必要なライブラリをインストール
COPY requirements.txt .
RUN pip install -r requirements.txt

# ソースコードをコピー
COPY . .

# 環境変数を設定（Flaskアプリのエントリーポイント）
ENV FLASK_APP=app.main
ENV FLASK_ENV=development
ENV PYTHONUNBUFFERED=1

# ポートを開放
EXPOSE 8000

# Flaskのデバッグモードで起動
CMD ["flask", "run", "--host=0.0.0.0", "--port=8000", "--reload"]
#CMD ["python", "main.py"]
