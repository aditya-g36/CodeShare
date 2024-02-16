from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.websockets import WebSocketState
from sqlalchemy.orm import Session
import secrets
import json
from collections import defaultdict

from websocket_manager import ConnectionManager
from database import engine, SessionLocal
import models
import schemas
import crud

import pdb

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

data = ""


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


manager = ConnectionManager()


@app.get("/exists/{note_id}/")
def exists(note_id, db: Session = Depends(get_db)):
    exists = db.query(models.Note).filter(
        models.Note.note_url == note_id).first() is not None

    data = {'exists': exists}

    return data


@app.get("/new/{note_language}/", response_model=schemas.Note)
def new_note(note_language: str, db: Session = Depends(get_db)):
    note_url = secrets.token_urlsafe(8)
    db_note = crud.create_note(db, note_url, note_language)
    return db_note


recent_data = defaultdict(None)


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str, db: Session = Depends(get_db)):
    global recent_data

    await manager.connect(websocket, client_id)
    note_id = client_id
    if note_id in recent_data and recent_data[note_id] is not None:
        await websocket.send_json(recent_data[note_id])
    else:
        note_data = crud.get_note(db, note_id)
        note_data = note_data.to_dict()
        init_data = {'note_content': note_data['note_content'],
                     'note_language': note_data['note_language']}
        await websocket.send_json(init_data)

    flag = False

    try:
        while True:
            data = await websocket.receive_json()
            recent_data[note_id] = data
            flag = True
            await manager.broadcast(data, note_id)

    except WebSocketDisconnect:
        if flag:
            if websocket.application_state == WebSocketState.CONNECTED:
                request = {
                    'note_url': note_id, 'note_content': data['note_content'], 'note_language': data['note_language']
                }

                crud.update_note(note_id, request, db)

    finally:
        if websocket.application_state == WebSocketState.CONNECTED:
            manager.disconnect(websocket, note_id)