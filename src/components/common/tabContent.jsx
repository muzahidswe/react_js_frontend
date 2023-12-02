import React from "react";

function tabContent({ status = "", contentName,component:Component }) {
  return (
    <div
      className={`tab-pane fade show ${status}`}
      id={contentName}
      role="tabpanel"
      aria-labelledby={`${contentName}-tab`}
    >
      <div className="card content-box">
        <div className="card-body content-box-body">
            <Component/>
        </div>
      </div>
    </div>
  );
}

export default tabContent;
