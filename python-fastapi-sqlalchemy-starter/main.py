"""FastAPI + SQLAlchemy todo app for Wasmer Edge.

The database comes from the environment, in this order:
1. DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD (the variables a Wasmer MySQL database provides)
2. DATABASE_URL (any SQLAlchemy URL)
3. A local SQLite file, which is fine for trying the app but is not shared between instances.
"""

import html
import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote_plus

from fastapi import Depends, FastAPI, Form, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import DateTime, String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker


def database_url() -> str:
    if os.environ.get("DB_HOST"):
        user = quote_plus(os.environ.get("DB_USERNAME", ""))
        password = quote_plus(os.environ.get("DB_PASSWORD", ""))
        host = os.environ["DB_HOST"]
        port = os.environ.get("DB_PORT", "3306")
        name = os.environ.get("DB_NAME", "")
        return f"mysql+pymysql://{user}:{password}@{host}:{port}/{name}"
    if os.environ.get("DATABASE_URL"):
        return os.environ["DATABASE_URL"]
    path = Path(os.environ.get("SQLITE_PATH", "/tmp/todos.db"))
    return f"sqlite:///{path}"


DATABASE_URL = database_url()
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class Todo(Base):
    __tablename__ = "todos"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    done: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class TodoIn(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    done: bool = False


class TodoOut(TodoIn):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


def get_db():
    with SessionLocal() as db:
        yield db


@asynccontextmanager
async def lifespan(_: FastAPI):
    # A starter keeps the schema simple: create missing tables on boot.
    Base.metadata.create_all(engine)
    yield


app = FastAPI(title="FastAPI + SQLAlchemy on Wasmer Edge", lifespan=lifespan)
STYLE = (Path(__file__).parent / "starter.css").read_text()


@app.get("/", response_class=HTMLResponse)
def index(db: Session = Depends(get_db)):
    todos = db.scalars(select(Todo).order_by(Todo.id.desc())).all()
    items = "".join(
        f'<li>{"<s>" if t.done else ""}{html.escape(t.title)}{"</s>" if t.done else ""} '
        f'<form method="post" action="/todos/{t.id}/toggle" style="display:inline">'
        f'<button type="submit" style="padding:2px 10px;font-size:13px">{"Undo" if t.done else "Done"}</button></form></li>'
        for t in todos
    ) or "<li>No todos yet. Add the first one.</li>"
    engine_name = engine.dialect.name
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>FastAPI + SQLAlchemy on Wasmer Edge</title><style>{STYLE}
form.add {{ display: flex; gap: 8px; margin: 0 0 20px; }}
form.add input {{ flex: 1; font: inherit; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg); color: var(--text); }}
</style></head>
<body><main>
<span class="badge">FastAPI + SQLAlchemy</span>
<h1>Your FastAPI app is live on Wasmer Edge</h1>
<p>Todos are stored with SQLAlchemy in <code>{engine_name}</code>. Edit <code>main.py</code> and push to redeploy.</p>
<form class="add" method="post" action="/todos"><input name="title" placeholder="What needs doing?" maxlength="200" required><button type="submit">Add</button></form>
<ul>{items}</ul>
<div class="actions"><a class="button secondary" href="/api/todos">JSON API</a><a class="button secondary" href="/docs">API docs</a></div>
<footer>FastAPI + SQLAlchemy starter for Wasmer Edge</footer>
</main></body></html>"""


@app.post("/todos")
def add_todo_form(title: str = Form(..., min_length=1, max_length=200), db: Session = Depends(get_db)):
    db.add(Todo(title=title.strip()))
    db.commit()
    return RedirectResponse("/", status_code=303)


@app.post("/todos/{todo_id}/toggle")
def toggle_todo_form(todo_id: int, db: Session = Depends(get_db)):
    todo = db.get(Todo, todo_id)
    if todo:
        todo.done = not todo.done
        db.commit()
    return RedirectResponse("/", status_code=303)


@app.get("/api/todos", response_model=list[TodoOut])
def list_todos(db: Session = Depends(get_db)):
    return db.scalars(select(Todo).order_by(Todo.id)).all()


@app.post("/api/todos", response_model=TodoOut, status_code=201)
def create_todo(todo: TodoIn, db: Session = Depends(get_db)):
    row = Todo(**todo.model_dump())
    db.add(row)
    db.commit()
    return row


@app.patch("/api/todos/{todo_id}", response_model=TodoOut)
def update_todo(todo_id: int, todo: TodoIn, db: Session = Depends(get_db)):
    row = db.get(Todo, todo_id)
    if not row:
        raise HTTPException(404, "Todo not found")
    row.title, row.done = todo.title, todo.done
    db.commit()
    return row


@app.delete("/api/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    row = db.get(Todo, todo_id)
    if not row:
        raise HTTPException(404, "Todo not found")
    db.delete(row)
    db.commit()
