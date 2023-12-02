import React from "react";
import { Link } from "react-router-dom";

function Footer(props) {
  return (
    <div
      className="footer bg-white mt-auto py-4 d-flex flex-lg-column position-sticky"
      id="kt_footer"
    >
      {/*begin::Container*/}
      <div className="container-fluid d-flex flex-column flex-md-row align-items-center justify-content-center">
        {/*begin::Copyright*/}
        <div className="text-dark order-2 order-md-1">
          <span className="text-muted font-weight-bold mr-2">2021©</span>
          <a
            href="https://apsissolutions.com/"
            target="_blank"
            className="text-dark-75 text-hover-primary"
          >
            Apsis Solutions Ltd.
          </a>
        </div>
        {/*end::Copyright*/}
      </div>
      {/*end::Container*/}
    </div>
  );
}

export default Footer;
