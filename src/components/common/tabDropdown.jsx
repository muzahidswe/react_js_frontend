import React from "react";
import { Link } from "react-router-dom";
function tabDropdown({ title, subTitle, status = "" }) {
  return (
    <li className="nav-item dropdown">
      <Link
        className={`nav-link dropdown-toggle ${status}`}
        data-toggle="dropdown"
        role="button"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {title}
      </Link>
      <div className="dropdown-menu">
        {subTitle.map((item) => {
          return (
            <Link
              aria-selected="true"
              data-toggle="tab"
              role="tab"
              key={item.id}
              className="dropdown-item "
              to={`/${item.to}`}
            >
              {item.title}
            </Link>
          );
        })}
      </div>
    </li>
  );
}

export default tabDropdown;
