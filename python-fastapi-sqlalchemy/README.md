# FastAPI + SQLAlchemy + Alembic (Todos)

Simple todo API using FastAPI, SQLAlchemy, and Alembic migrations.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .
```

## Database (MySQL)

You can configure the connection either with `DATABASE_URL` or separate env vars:

```bash
export DB_NAME=todos
export DB_USERNAME=root
export DB_PASSWORD=""
export DB_HOST=127.0.0.1
export DB_PORT=3306
# or override everything with DATABASE_URL
# export DATABASE_URL="mysql+pymysql://user:pass@localhost:3306/todos"
```

Create the database (if not already):

```bash
mysql -u user -p -e "CREATE DATABASE IF NOT EXISTS todos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

Run migrations:

```bash
alembic upgrade head
```

## Run the API

```bash
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

## Endpoints

- `GET /` – health ping
- `POST /todos` – create a todo `{ "title": "Buy milk", "description": "...", "done": false }`
- `GET /todos` – list todos
- `GET /todos/{id}` – fetch a single todo
- `PATCH /todos/{id}` – update fields (title, description, done)

Example update:

```bash
curl -X PATCH http://localhost:8000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"done": true}'
```
