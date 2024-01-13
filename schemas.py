from typing import List, Union, Optional

from pydantic import BaseModel


class NoteBase(BaseModel):
    note_url: str
    note_content: Union[str, None] = None


class Note(NoteBase):
    class Config:
        orm_mode = True


class UpdateNote(NoteBase):
    note_url: Optional[str]
    note_content: Optional[str]