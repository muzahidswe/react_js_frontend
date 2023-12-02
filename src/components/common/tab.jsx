import React from "react";
import { Link } from "react-router-dom";

function Tab({ title, tabName, status = "" }) {
  return (
    <li className="nav-item" role="presentation">
      <Link
        className={`nav-link ${status}`}
        aria-selected="true"
        data-toggle="tab"
        role="tab"
        id={`${tabName}-tab`}
        to={`/${tabName}`}
        aria-controls={tabName}
      >
        {title}
      </Link>
    </li>
  );
}

export default Tab;
