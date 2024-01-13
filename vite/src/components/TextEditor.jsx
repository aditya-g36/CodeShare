import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

const socket = new WebSocket("ws://localhost:8000/ws/1");

const TextEditor = () => {
  const { noteID } = useParams();
  console.log(noteID);
  useEffect(() => {
    if (socket.readyState === WebSocket.OPEN && noteID) {
      socket.send(noteID.slice(1));
      console.log(noteID.slice(1));
    }
  }, [socket.readyState, noteID]);

  const [value, setValue] = useState("");

  socket.onmessage = (event) => {
    setValue(event.data);
  };

  const handleChange = (newValue, e) => {
    setValue(newValue);
    socket.send(newValue);
    console.log(newValue);
  };
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Editor
        id="editor"
        defaultLanguage="javascript"
        value={value}
        onChange={handleChange}
        options={{ minimap: { enabled: false } }}
        theme="vs-dark"
        automaticLayout={true}
        scrollBeyondLastLine={false}
        scrollbar={{ alwaysConsumeMouseWheel: false }}
      />
    </div>
  );
};

export default TextEditor;
