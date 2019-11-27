import React, { Component } from "react";
import { Link } from "react-router-dom";

class SignedInLinks extends Component {
  render() {
    const { userInitials, logout, activePage, handleActivePage } = this.props;

    return (
      <React.Fragment>
        <ul className="right">
          <li
            onClick={() => handleActivePage("about")}
            className={activePage === "about" ? "active" : ""}
          >
            <Link to="/about">About</Link>
          </li>
          <li
            onClick={() => handleActivePage("profile")}
            className={activePage === "profile" ? "active" : ""}
          >
            <Link to="/profile" className="btn btn-floating white red-text">
              {userInitials}
            </Link>
          </li>
          <li onClick={() => logout()}>
            <Link to="/">Logout</Link>
          </li>
        </ul>
      </React.Fragment>
    );
  }
}

export default SignedInLinks;
