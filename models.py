from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    note_url = Column(String, unique=True, index=True)
    note_content = Column(String, default="Your new note")
    note_language = Column(String, default="plain_text")

    def to_dict(self):
        return {
            "note_url": self.note_url,
            "note_content": self.note_content,
            "note_language": self.note_language,
        }