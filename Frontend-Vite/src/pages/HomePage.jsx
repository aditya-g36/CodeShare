import React from "react";
import { useNavigate } from "react-router-dom";
import { NavbarWithMegaMenu } from "../components/navbar";
import { TypeAnimation } from "react-type-animation";

import {
  Collapse,
  Typography,
  Button,
  IconButton,
  Card,
} from "@material-tailwind/react";
import backgroundImage from "../assets/backgroundImage.jpg";
import NewNote from "../components/NewNote";
import SearchBar from "../components/SearchBar";

export function HomePage() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/editor");
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
      }}
    >
      <NavbarWithMegaMenu />

      <div className="h-full w-full min-h-screen ">
        <div className="mx-auto max-w-screen-md py-12  flex flex-col items-center justify-center space-y-32 ">
          <div className="flex flex-col items-center justify-center space-y-4">
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                "Welcome to Syncr",
                1000, // wait 1s before replacing "Mice" with "Hamsters"
                "Share Code in Real-time",
                1000,
              ]}
              wrapper="span"
              speed={50}
              style={{
                fontSize: "2em",
                display: "inline-block",
                color: "white",
              }}
              repeat={Infinity}
            />
            <Typography color="white" className="font-normal">
              An online code editor for interviews, troubleshooting, teaching &
              more…
            </Typography>
          </div>
          <div className="flex flex-col items-center justify-center space-y-8">
            <SearchBar />
            <NewNote />
          </div>
        </div>
      </div>
    </div>
  );
}
