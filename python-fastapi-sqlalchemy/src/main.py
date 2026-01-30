from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from .database import get_session
from .models import Todo
from .schemas import TodoCreate, TodoRead, TodoUpdate

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(title="Todos API", version="0.1.0")


@app.get("/", include_in_schema=False)
async def root():
    index_path = STATIC_DIR / "index.html"
    if not index_path.exists():
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "index.html not found"},
        )
    return FileResponse(index_path, media_type="text/html")


@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok"}


def _get_todo_or_404(todo_id: int, db: Session) -> Todo:
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found"
        )
    return todo


@app.post("/todos", response_model=TodoRead, status_code=status.HTTP_201_CREATED)
def create_todo(payload: TodoCreate, db: Session = Depends(get_session)) -> Todo:
    todo = Todo(
        title=payload.title, description=payload.description, done=payload.done
    )
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


@app.get("/todos", response_model=list[TodoRead])
def list_todos(db: Session = Depends(get_session)) -> list[Todo]:
    todos = db.execute(select(Todo).order_by(Todo.created_at.desc()))
    return todos.scalars().all()


@app.get("/todos/{todo_id}", response_model=TodoRead)
def get_todo(todo_id: int, db: Session = Depends(get_session)) -> Todo:
    return _get_todo_or_404(todo_id, db)


@app.patch("/todos/{todo_id}", response_model=TodoRead)
def update_todo(
    todo_id: int, payload: TodoUpdate, db: Session = Depends(get_session)
) -> Todo:
    todo = _get_todo_or_404(todo_id, db)

    updated = False
    if payload.title is not None:
        todo.title = payload.title
        updated = True
    if payload.description is not None:
        todo.description = payload.description
        updated = True
    if payload.done is not None:
        todo.done = payload.done
        updated = True

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided to update",
        )

    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
