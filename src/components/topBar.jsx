import React, { Fragment, useState, useEffect } from "react";
import Profile from "./profile";
import { getCurrentUser } from "../services/authService";

function TopBar(props) {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const user = getCurrentUser();
    if (user?.data) setCurrentUser(user.data);
  }, []);
  return (
    <Fragment>
      <div id="kt_header" className="header header-fixed">
        {/*begin::Container*/}
        <div className="container-fluid d-flex align-items-stretch justify-content-between">
          {/*begin::Header Menu Wrapper*/}
          <div
            className="header-menu-wrapper header-menu-wrapper-left"
            id="kt_header_menu_wrapper"
          >
            {/*begin::Header Menu*/}

            {/*end::Header Menu*/}
          </div>
          {/*end::Header Menu Wrapper*/}
          {/*begin::Topbar*/}
          <div className="topbar">
            {/*begin::Search*/}
            <div  className="dropdown" id="kt_quick_search_toggle">
              {/*begin::Toggle*/}
              <div
                className="topbar-item"
                data-toggle="dropdown"
                data-offset="10px,0px"
              >
               
              </div>
              {/*end::Toggle*/}
              {/*begin::Dropdown*/}
              <div className="dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim-up dropdown-menu-lg">
                <div
                  className="quick-search quick-search-dropdown"
                  id="kt_quick_search_dropdown"
                >
                  {/*begin:Form*/}
                  <form method="get" className="quick-search-form">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <span className="svg-icon svg-icon-lg">
                            {/*begin::Svg Icon | path:assets/media/svg/icons/General/Search.svg*/}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                              width="24px"
                              height="24px"
                              viewBox="0 0 24 24"
                              version="1.1"
                            >
                              <g
                                stroke="none"
                                strokeWidth={1}
                                fill="none"
                                fillRule="evenodd"
                              >
                                <rect x={0} y={0} width={24} height={24} />
                                <path
                                  d="M14.2928932,16.7071068 C13.9023689,16.3165825 13.9023689,15.6834175 14.2928932,15.2928932 C14.6834175,14.9023689 15.3165825,14.9023689 15.7071068,15.2928932 L19.7071068,19.2928932 C20.0976311,19.6834175 20.0976311,20.3165825 19.7071068,20.7071068 C19.3165825,21.0976311 18.6834175,21.0976311 18.2928932,20.7071068 L14.2928932,16.7071068 Z"
                                  fill="#000000"
                                  fillRule="nonzero"
                                  opacity="0.3"
                                />
                                <path
                                  d="M11,16 C13.7614237,16 16,13.7614237 16,11 C16,8.23857625 13.7614237,6 11,6 C8.23857625,6 6,8.23857625 6,11 C6,13.7614237 8.23857625,16 11,16 Z M11,18 C7.13400675,18 4,14.8659932 4,11 C4,7.13400675 7.13400675,4 11,4 C14.8659932,4 18,7.13400675 18,11 C18,14.8659932 14.8659932,18 11,18 Z"
                                  fill="#000000"
                                  fillRule="nonzero"
                                />
                              </g>
                            </svg>
                            {/*end::Svg Icon*/}
                          </span>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search..."
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <i className="quick-search-close ki ki-close icon-sm text-muted" />
                        </span>
                      </div>
                    </div>
                  </form>
                  {/*end::Form*/}
                  {/*begin::Scroll*/}
                  <div
                    className="quick-search-wrapper scroll"
                    data-scroll="true"
                    data-height={325}
                    data-mobile-height={200}
                  />
                  {/*end::Scroll*/}
                </div>
              </div>
              {/*end::Dropdown*/}
            </div>
            {/*end::Search*/}

            {/*begin::User*/}
            <div className="topbar-item">
              <div
                className="btn btn-icon btn-icon-mobile w-auto btn-clean d-flex align-items-center btn-lg px-2"
                id="kt_quick_user_toggle"
              >
                <span className="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">
                  Hi,
                </span>
                <span className="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">
                  {currentUser?.name || "User"}
                </span>
                <span className="symbol symbol-lg-35 symbol-25 symbol-light-success">
                  <span className="symbol-label font-size-h5 font-weight-bold">
                    {currentUser?.name[0].toUpperCase() || "S"}
                  </span>
                </span>
              </div>
            </div>
            {/*end::User*/}
          </div>
          {/*end::Topbar*/}
        </div>
        {/*end::Container*/}
      </div>
      {/* start here */}
      <Profile />
    </Fragment>
  );
}

export default TopBar;
