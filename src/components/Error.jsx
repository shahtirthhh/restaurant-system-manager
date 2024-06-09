import React from "react";
import error_img from "../assests/error.png";

function Error({ msg }) {
  return (
    <div className="flex flex-col justify-center items-center">
      <img className="w-36 h-36" src={error_img} alt="Error..." />
      <h4 className="text-center text-xl font-bold font-primary text-primary_font">
        {msg}
      </h4>
    </div>
  );
}

export default Error;
