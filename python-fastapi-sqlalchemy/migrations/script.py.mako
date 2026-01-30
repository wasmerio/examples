"""Generic Alembic revision script."""
from alembic import op  # type: ignore
import sqlalchemy as sa  # type: ignore

revision = ${repr(up_revision)}
down_revision = ${repr(down_revision)}
branch_labels = ${repr(branch_labels)}
depends_on = ${repr(depends_on)}


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

