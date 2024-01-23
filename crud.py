from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse

import models
import schemas


def get_note(db: Session, note_url: str):
    note = db.query(models.Note).filter(
        models.Note.note_url == note_url).first()

    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Note with id {note_url} not found")

    return note


def create_note(db: Session, note_url: str, note_language):
    new_note = models.Note(
        note_url=note_url, note_language=note_language)
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note


def delete_note(db: Session, note_url: str):
    note = db.query(models.Note).filter(models.Note.note_url == note_url)

    if not note.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Note with id {note_url} not found")

    note.delete(synchronize_session=False)
    db.commit()
    return 'done'


def update_note(note_url: str, request: schemas.Note, db: Session):

    note = db.query(models.Note).filter(
        models.Note.note_url == note_url).first()

    if not note:
        content = {'success': False,
                   'message': f"Note with url {note_url} don't exists"}
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content=content)

    db.query(models.Note).filter(models.Note.note_url == note_url).update(
        request)
    db.commit()

    content = {'success': True,
               'message': f"Note with note {note_url} Updated"}
    return JSONResponse(status_code=status.HTTP_200_OK, content=content)