import React from "react";
import { useNavigate } from "react-router-dom";
import FavIcon from "../assets/icons/FavIcon";
import { useAuthContext } from "../context/AuthContext";
import { toastWarnNotify } from "../helper/ToastNotify";

const FavComp = ({ fav }) => {
  let navigate = useNavigate();

  const { currentUser } = useAuthContext();

  return (
    <span
      className="hidden-arrow mr-4 flex items-center opacity-60 hover:opacity-80 focus:opacity-80 text-zinc-500 dark:text-white"
      role="button"
      onClick={() => {
        navigate("/favorites");
        !currentUser && toastWarnNotify("Please log in to see favorites");
      }}
    >
      <FavIcon />
      <span className="absolute -mt-4 ml-3 rounded-full bg-red-700 py-0 px-1.5 text-xs text-white">
        {fav || null}
      </span>
    </span>
  );
};

export default FavComp;
