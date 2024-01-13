from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
import secrets
from websocket_manager import ConnectionManager
from database import engine, SessionLocal
import models
import schemas
import crud

import pdb

app = FastAPI()

models.Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


manager = ConnectionManager()


@app.get("/get/{note_url}/", response_model=schemas.Note)
def show(note_url: str, db: Session = Depends(get_db)):
    note = crud.get_note(db, note_url)
    return note


@app.get("/new/", response_model=schemas.Note)
def new_note(db: Session = Depends(get_db)):
    note_url = secrets.token_urlsafe(8)
    db_note = crud.create_note(db, note_url)
    return db_note


@app.put("/update/{note_url}", response_model=schemas.Note)
def update_note(request: schemas.UpdateNote, note_url: str, db: Session = Depends(get_db)):

    return crud.update_note(note_url, request, db)


@app.websocket("/ws/{note_url}")
async def websocket_endpoint(websocket: WebSocket, note_url: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(data)

    except WebSocketDisconnect:
        manager.disconnect(websocket)


