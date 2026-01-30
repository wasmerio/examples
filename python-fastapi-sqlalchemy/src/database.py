import os
from collections.abc import Generator
from urllib.parse import quote_plus

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker


def _build_database_url() -> str:
    if url := os.getenv("DATABASE_URL"):
        return url

    name = os.getenv("DB_NAME", "todos")
    user = os.getenv("DB_USERNAME", "root")
    password = os.getenv("DB_PASSWORD", "")
    host = os.getenv("DB_HOST", "127.0.0.1")
    port = os.getenv("DB_PORT", "3306")
    return f"mysql+pymysql://{user}{':' + quote_plus(password) if password else ''}@{host}:{port}/{name}"


DATABASE_URL = _build_database_url()

engine = create_engine(DATABASE_URL, pool_pre_ping=True, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


class Base(DeclarativeBase):
    """Base class for SQLAlchemy models."""


def get_session() -> Generator[Session, None, None]:
    """Provide a database session per-request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
