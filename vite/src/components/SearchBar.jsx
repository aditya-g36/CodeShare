import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input, Button } from "@material-tailwind/react";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchBar, setSearchBar] = useState(false);

  const handleClick = async () => {
    let note_id = document.getElementById("input_id").value;

    let response = await axios
      .get(`http://localhost:8000/exists/${note_id}`)
      .then((response) => {
        let exists = response.data.exists;
        console.log(exists);
        if (exists) {
          navigate(`/editor/:${note_id}`);
        }
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
      <div className="flex justify-center pt-2 ml-7 sticky top-0">
        <form className="relative ">
          <input
            id="input_id"
            type="text"
            placeholder="Your Note ID"
            className="py-2 pr-4 pl-4 rounded-full w-80 bg-gray-100 bg-zinc-800 focus:outline-none focus:ring-0 focus:border-transparent "
          />
          <Button
            size="sm"
            color="gray"
            className="!absolute right-1 top-1 rounded-full"
            onClick={handleClick}
          >
            Search
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
