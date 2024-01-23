from fastapi import WebSocket
from collections import defaultdict


class ConnectionManager:
    def __init__(self):
        self.active_connections = defaultdict(
            list)   # {'note_id': [ws, ws, ws]}

    async def connect(self, websocket: WebSocket, note_id: str):
        await websocket.accept()
        self.active_connections[note_id].append(websocket)

    def disconnect(self, websocket: WebSocket, note_id: str):
        self.active_connections[note_id].remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, data, note_id):
        for connection in self.active_connections[note_id]:
            await connection.send_json(data)