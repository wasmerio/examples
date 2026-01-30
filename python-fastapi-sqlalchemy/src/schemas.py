from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None


class TodoCreate(TodoBase):
    done: bool = False


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    done: Optional[bool] = None

    model_config = ConfigDict(extra="forbid")


class TodoRead(TodoBase):
    id: int
    done: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

