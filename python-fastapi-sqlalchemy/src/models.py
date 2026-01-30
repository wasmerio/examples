from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, func

from .database import Base


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    done = Column(Boolean, nullable=False, default=False, server_default="0")
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    def __repr__(self) -> str:  # pragma: no cover - convenience only
        return f"Todo(id={self.id!r}, title={self.title!r}, done={self.done!r})"

