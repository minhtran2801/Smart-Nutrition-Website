import React from "react";
import { Link } from "react-router-dom";

const SignedOutLinks = ({ activePage, handleActivePage }) => {
  return (
    <ul className="right">
      <li
        onClick={() => handleActivePage("about")}
        className={activePage === "about" ? "active" : ""}
      >
        <Link to="/about">About</Link>
      </li>
      <li
        onClick={() => handleActivePage("login")}
        className={activePage === "login" ? "active" : ""}
      >
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );
};

export default SignedOutLinks;
