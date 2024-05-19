/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
const Landingpage = () => {
  return (
    <>
      <div className="">
        <div className="flex items-center justify-center gap-10 text-3xl bg-sky-700">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </>
  );
};

export default Landingpage;
