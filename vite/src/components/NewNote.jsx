import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Dialog, DialogHeader, DialogBody } from "@material-tailwind/react";

import { FaPython, FaJava, FaHtml5 } from "react-icons/fa";
import { SiCplusplus, SiJavascript } from "react-icons/si";
import { GrTextAlignLeft } from "react-icons/gr";
import { Button } from "@material-tailwind/react";

const NewNote = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const handleClick = async (language) => {
    let response = await axios
      .get(`http://localhost:8000/new/${language}/`)
      .then((response) => {
        const note_id = response.data.note_url;
        console.log(note_id);
        navigate(`/editor/:${note_id}`);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  };
  return (
    <div>
      <Button
        variant="gradient"
        onClick={handleOpen}
        className="flex items-center gap-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
          />
        </svg>
        New Note
      </Button>
      <Dialog open={open} handler={handleOpen}>
        <h3 className="text-center text-black pt-8">Choose a language</h3>

        <div className="w-full py-8 flex-col text-7xl">
          <div className="flex justify-center gap-12">
            <div
              className="flex-col px-4 py-2 rounded-lg hover:bg-blue-gray-100 cursor-pointer"
              onClick={() => handleClick("plain_text")}
            >
              <GrTextAlignLeft className="mx-auto" />
              <p className="text-lg font-bold text-center">Plain Text</p>
            </div>
            <div
              className="flex-col px-4 py-2 rounded-lg hover:bg-blue-gray-100 cursor-pointer"
              onClick={() => handleClick("python")}
            >
              <FaPython className="mx-auto" />
              <p className="text-lg font-bold text-center">Python</p>
            </div>
            <div
              className="flex-col px-4 py-2 rounded-lg hover:bg-blue-gray-100 cursor-pointer"
              onClick={() => handleClick("javascript")}
            >
              <SiJavascript className="mx-auto" />
              <p className="text-lg font-bold text-center">JavaScript</p>
            </div>
          </div>
          <div className="flex justify-center gap-12 mt-8 text-7xl">
            <div
              className="flex-col px-4 py-2 rounded-lg hover:bg-blue-gray-100 cursor-pointer"
              onClick={() => handleClick("html")}
            >
              <FaHtml5 className="mx-auto" />
              <p className="text-lg font-bold text-center">HTML</p>
            </div>
            <div
              className="flex-col px-4 py-2 rounded-lg hover:bg-blue-gray-100 cursor-pointer"
              onClick={() => handleClick("java")}
            >
              <FaJava className="mx-auto" />
              <p className="text-lg font-bold text-center">Java</p>
            </div>
            <div
              className="flex-col px-4 py-2 rounded-lg hover:bg-blue-gray-100 cursor-pointer"
              onClick={() => handleClick("c++")}
            >
              <SiCplusplus className="mx-auto" />
              <p className="text-lg font-bold text-center">C++</p>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default NewNote;
