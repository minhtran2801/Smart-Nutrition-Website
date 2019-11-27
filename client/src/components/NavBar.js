import React from "react";
import { Link } from "react-router-dom";
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLinks";

const NavBar = ({
  activePage,
  handleActivePage,
  userInitials,
  logout,
  loggedIn
}) => {
  return (
    <nav>
      <div className="nav-wrapper">
        <Link
          to="/"
          className="brand-logo center"
          onClick={() => {
            handleActivePage("home");
          }}
        >
          Smart Food
        </Link>
        {loggedIn ? (
          <SignedInLinks
            userInitials={userInitials}
            logout={logout}
            activePage={activePage}
            handleActivePage={handleActivePage}
          />
        ) : (
          <SignedOutLinks
            activePage={activePage}
            handleActivePage={handleActivePage}
          />
        )}
      </div>
    </nav>
  );
};

export default NavBar;
