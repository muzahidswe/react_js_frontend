import React, { useState, useEffect } from "react";
import Select from "react-select";
import { NavLink, Link } from "react-router-dom";
import { ReactComponent as Arrow } from "../svg/sidebarArrow.svg";
import { ReactComponent as Dashboard } from "../svg/dashboard.svg";
import { ReactComponent as Credit } from "../svg/credit.svg";
import { ReactComponent as Kyc } from "../svg/kyc.svg";
import { ReactComponent as Reports } from "../svg/reports.svg";
import { ReactComponent as Setting } from "../svg/setting.svg";
/* import Menulist from "./MenuList"; */
import { useDispatch } from 'react-redux';
import { FiSet } from '../actions/fi';
import { logOut } from "../services/authService";
import { useHistory } from 'react-router-dom';
import styles from './sidebar.module.css';

function SideBar(props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const [showContent, setShowContent] = useState(true);

  const [user_type, setUserType] = useState(localStorage.getItem('cr_user_type'));
  const [user_id, setUserId] = useState(localStorage.getItem('id'));

  const [selectedFiValue, setSelectedFiValue] = useState();
  const [cr_setting_menu, settingMenu] = useState(localStorage.getItem('setting_menu'));

  const getFiOptions = () => {
    if ((localStorage.getItem('fi_info') !== null) ) {
      let rawArray = JSON.parse(localStorage.getItem('fi_info'));
      return rawArray.map(item => {return {label:item?.name, value: item?.id}})
    } else {
      return []
    }
  }

  const checkFiSelectionDisabled = () => {
    let permissions = JSON.parse(localStorage.getItem('permitted_fi'));
    if (permissions?.multi_access) {
      return false;
    } else {
      return true;
    }
  }

  const setDefaultFiSelection = () => {
    if ((localStorage.getItem('permitted_fi') !== null) && (localStorage.getItem('fi_info') !== null) ) {
      let rawArray = JSON.parse(localStorage.getItem('fi_info'));
      let permissions = JSON.parse(localStorage.getItem('permitted_fi'));
      let selected = rawArray.find(item => item?.id === permissions?.default_fi)

      return {label: selected?.name, value: selected?.id}
    } else {
      return {}
    }
  }

  const handleFiChange = (e) => {
    dispatch(FiSet(e?.value))
    setSelectedFiValue(e)
  }

  const handleLogoutBtn = () => {
    setShowContent(false);
    logOut();
    history.push('/');
    window.location.reload();
  }

  useEffect(() => {
    // window.jQuery = $;
    // window.$ = $;
    // global.jQuery = $;
    const script2 = document.createElement("script");
    script2.src = "/assets/plugins/global/plugins.bundle.js";
    script2.async = true;
    document.body.appendChild(script2);

    if ((localStorage.getItem('permitted_fi') !== null) && (localStorage.getItem('fi_info') !== null) ) {
      let rawArray = JSON.parse(localStorage.getItem('fi_info'));
      let permissions = JSON.parse(localStorage.getItem('permitted_fi'));
      let selected = rawArray.find(item => item?.id === permissions?.default_fi)
      dispatch(FiSet(selected?.id));
    } else {
      logOut();
      history.push('/');
    }
  }, []);
  const [selectedMenu, setSelectedMenu] = useState(localStorage.getItem('selected_menu'));
  const [selectedParentMenu, setSelectedParentMenu] = useState(localStorage.getItem('selected_parent_menu'));
  useEffect(() => {
    localStorage.setItem("selected_menu", selectedMenu);
    localStorage.setItem("selected_parent_menu", selectedParentMenu);
  }, [selectedMenu, selectedParentMenu]);
  return (
    <>
      {showContent &&
        <div
          className="aside aside-left aside-fixed d-flex flex-column flex-row-auto"
          id="kt_aside"
          style={{ zIndex: 8888 }}
        >
          {/*begin::Brand*/}
          <div className="brand flex-column-auto" id="kt_brand">
            {/*begin::Logo*/}
            <Link to="/dashboard_v3" className="brand-logo">
              <img
                alt="Logo"
                style={{ height: 50 }}
                src="/./assets/images/logo/unnoti_logo_white_edit.png"
              />
              {/* <h6 className="text-white ">CREDIT</h6> */}
            </Link>
            {/* */}
            {/*end::Logo*/}
            {/*begin::Toggle*/}
            <button className="brand-toggle btn btn-sm px-0" id="kt_aside_toggle">
              <span className="svg-icon svg-icon svg-icon-xl">
                {/*begin::Svg Icon | path:assets/media/svg/icons/Navigation/Angle-double-left.svg*/}
                <Arrow />

                {/*end::Svg Icon*/}
              </span>
            </button>
            {/*end::Toolbar*/}
          </div>
          {/*end::Brand*/}
          {/*begin::Aside Menu*/}
          <div
            className="aside-menu-wrapper flex-column-fluid"
            id="kt_aside_menu_wrapper"
          >
            {/*begin::Menu Container*/}
            <div
              id="kt_aside_menu"
              className="aside-menu my-4"
              data-menu-vertical={1}
              data-menu-scroll={1}
              data-menu-dropdown-timeout={500}
            >
              {/*begin::Menu Nav*/}
              <ul className="menu-nav">
                <li style={{display: 'none'}} className={selectedMenu == 'Dashboard' ? "menu-item menu-item-active" : "menu-item"}  aria-haspopup="true">
                  <NavLink onClick={()=>setSelectedMenu('Dashboard')} to="/dashboard" className="menu-link">
                    <span className="svg-icon menu-icon">
                      <Dashboard />
                    </span>
                    <span className="menu-text">Dashboard</span>
                  </NavLink>
                </li>

                {(user_type === 'superadmin' || user_type === 'admin' || user_type === 'apsis_support') &&
                  <li style={{padding: '2rem'}}>
                    <Select
                      name="fi_selection"
                      defaultValue={setDefaultFiSelection()}
                      value={selectedFiValue}
                      options={getFiOptions()}
                      isDisabled={checkFiSelectionDisabled()}
                      onChange={(e) => { handleFiChange(e) }}
                      labelledBy="fi_selection"
                    />
                  </li>
                }

                <li className={selectedParentMenu == 'DashboardV3' ? "menu-item menu-item-active" : "menu-item"}  aria-haspopup="true">
                  <NavLink onClick={()=>setSelectedParentMenu('DashboardV3')} to="/dashboard_v3" className="menu-link">
                    <span className="svg-icon menu-icon">
                      <Dashboard />
                    </span>
                    <span className="menu-text">Dashboard</span>
                  </NavLink>
                </li>
                <hr></hr>
                {/* changes made here */}

                <li
                  onClick={()=>setSelectedParentMenu('KYC')}
                  className={selectedParentMenu == 'KYC' ? "menu-item menu-item-submenu menu-item-open" : "menu-item menu-item-submenu"}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <Link to="#" className="menu-link menu-toggle">
                    <span className="svg-icon menu-icon">
                      <Kyc />
                    </span>
                    <span className="menu-text">KYC</span>
                    <i className="menu-arrow" />
                  </Link>
                  <div className="menu-submenu">
                    <i className="menu-arrow" />
                    <ul className="menu-subnav">
                      <li
                        className="menu-item menu-item-parent"
                        aria-haspopup="true"
                      >
                        <span className="menu-link">
                          <span className="menu-text">KYC</span>
                        </span>
                      </li>
                      {(user_type == 'superadmin' || user_type == 'admin' || user_type == 'bat') ? (
                      <li className={selectedMenu == 'Scope Outlets' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Scope Outlets')} to="/scope-outlet-preview" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Scope Outlets</span>
                        </Link>
                      </li>) : <></>}
                      {(user_type == 'fi') ? (
                      <li className={selectedMenu == 'Scope Outlets' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Scope Outlets')} to="/scope-outlet-preview-fi" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Scope Outlets</span>
                        </Link>
                      </li>) : <></>}
                      {(user_type == 'fi') ? (
                      <li className={selectedMenu == 'KYC History' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('KYC History')} to="/kyc-list" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">KYC History</span>
                        </Link>
                      </li>) : <></>}
                      {(user_type == 'superadmin' || user_type == 'admin' || user_type == 'apsis_support') ? (
                      <li className={selectedMenu == 'Leaderboard' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Leaderboard')} to="/leaderboard" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Leaderboard</span>
                        </Link>
                      </li>) : <></>}

                      {/* {(user_type == 'superadmin' || user_type == 'admin') ? (
                      <li className={selectedMenu == 'National Launch Update' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('National Launch Update')} to="/national-launch-update" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">National Launch Update</span>
                        </Link>
                      </li>) : <></>} */}

              {(user_type == 'superadmin' || user_type == 'admin' || user_type == 'bat') ? (
                      <li className={selectedMenu == 'KYC History' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('KYC History')} to="/kyc-list-dh" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">KYC History</span>
                        </Link>
                      </li>) : <></>}
                      <li className={selectedMenu == 'KYC Done by SS' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('KYC Done by SS')} to="/kyc-without-docs" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">KYC Done by SS</span>
                        </Link>
                      </li>
              {(user_type == 'fi') ? (
                      <li className={selectedMenu == 'KYC Approve (Excel)' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('KYC Approve (Excel)')} to="/bulk-kyc-approve" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">KYC Approve (Excel)</span>
                        </Link>
                      </li>) : <></>}
                      <li className={selectedMenu == 'Rejected Outlets' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Rejected Outlets')} to="/kyc-rejected" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Rejected Outlets</span>
                        </Link>
                      </li>
              {(user_type == 'superadmin' || user_type == 'fi') ? (
                      <li className={selectedMenu == 'retailer-information-upload' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('retailer-information-upload')} to="/retailer-information-upload" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Retailer NID Info</span>
                        </Link>
                      </li>) : <></>}
                      {(user_type == 'superadmin' || user_type == 'admin' || user_type == 'apsis_support') ? (
                      <li className={selectedMenu == 'ekyc-list' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('ekyc-list')} to="/ekyc-list" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">eKYC List</span>
                        </Link>
                      </li>) : <></>}

                      {(user_type == 'fi') ? (
                      <li className={selectedMenu == 'Loan Account & Client ID' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Loan Account & Client ID')} to="/loan-account-and-client-id" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Loan Account & Client ID</span>
                        </Link>
                      </li>) : <></>}

                    </ul>
                  </div>
                </li>

                <li
                  onClick={()=>setSelectedParentMenu('Credit')}
                  className={selectedParentMenu == 'Credit' ? "menu-item menu-item-submenu menu-item-open" : "menu-item menu-item-submenu"}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <Link to="#" className="menu-link menu-toggle">
                    <span className="svg-icon menu-icon">
                      <Credit />
                    </span>
                    <span className="menu-text">Credit</span>
                    <i className="menu-arrow" />
                  </Link>
                  <div className="menu-submenu">
                    <i className="menu-arrow" />
                    <ul className="menu-subnav">
                      <li
                        className="menu-item menu-item-parent"
                        aria-haspopup="true"
                      >
                        <span className="menu-link">
                          <span className="menu-text">Credit</span>
                        </span>
                      </li>
                      <li className={selectedMenu == 'Confirmed Limits' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Confirmed Limits')} to="/confirmed-limits" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Confirmed Limits</span>
                        </Link>
                      </li>
                      {(user_type == 'superadmin' || user_type == 'admin' || user_type == 'fi') ? (
                      <li className={selectedMenu == 'Credit Upload' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Credit Upload')} to="/credit-upload" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Credit Upload</span>
                        </Link>
                      </li>) : <></>}

                      {(user_type == 'superadmin' || user_type == 'admin') ? (
                      <li className={selectedMenu == 'Credit Preview (DH)' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Credit Preview (DH)')} to="/credit-preview" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Credit Preview (Admin)</span>
                        </Link>
                      </li>) : <></>}

                      {(user_type == 'superadmin' || user_type == 'admin' || user_type == 'fi') ? (
                      <li className={selectedMenu == 'Credit Preview (FI)' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Credit Preview (FI)')} to="/credit-preview-fi" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Credit Preview (FI)</span>
                        </Link>
                      </li>) : <></>}
                      {/*  <li className="menu-item" aria-haspopup="true">
                        <Link to="/credit-disburse" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Credit disburse</span>
                        </Link>
                      </li> */}


                    </ul>
                  </div>
                </li>
                <li
                  onClick={()=>setSelectedParentMenu('Disbursement')}
                  className={selectedParentMenu == 'Disbursement' ? "menu-item menu-item-submenu menu-item-open" : "menu-item menu-item-submenu"}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <Link to="#" className="menu-link menu-toggle">
                    <span className="svg-icon menu-icon">
                      <Kyc />
                    </span>
                    <span className="menu-text">Disbursement</span>
                    <i className="menu-arrow" />
                  </Link>
                  <div className="menu-submenu">
                    <i className="menu-arrow" />
                    <ul className="menu-subnav">
                      <li
                        className="menu-item menu-item-parent"
                        aria-haspopup="true"
                      >
                        <span className="menu-link">
                          <span className="menu-text">Disbursement</span>
                        </span>
                      </li>

                      {(user_type == 'superadmin' || user_type == 'admin' || user_type == 'bat') ? (
                      <li className={selectedMenu == 'Credit Disbursement Request' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                      <Link onClick={()=>setSelectedMenu('Credit Disbursement Request')} to="/credit-disbursement-request" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Credit Disbursement Request</span>
                        </Link>
                      </li>) : <></>}
                        {(user_type == 'superadmin' || user_type == 'admin' || user_type == 'fi') ? (
                        <li className={selectedMenu == 'Requested Disbursement' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Requested Disbursement')} to="/fi-disbursement-history" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Requested Disbursement</span>
                        </Link></li>) : <></>}
                      <li className={selectedMenu == 'Disbursement History' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Disbursement History')} to="/dh-disbursement-history" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Disbursement History</span>
                        </Link>
                      </li>
                      <li className={selectedMenu == 'Issue List' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Issue List')} to="/issue-list" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Issue List</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
                <li
                  onClick={()=>setSelectedParentMenu('Settlement')}
                  className={selectedParentMenu == 'Settlement' ? "menu-item menu-item-submenu menu-item-open" : "menu-item menu-item-submenu"}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <Link to="#" className="menu-link menu-toggle">
                    <span className="svg-icon menu-icon">
                      <Kyc />
                    </span>
                    <span className="menu-text">Settlement</span>
                    <i className="menu-arrow" />
                  </Link>
                  <div className="menu-submenu">
                    <i className="menu-arrow" />
                    <ul className="menu-subnav">
                      <li
                        className="menu-item menu-item-parent"
                        aria-haspopup="true"
                      >
                        <span className="menu-link">
                          <span className="menu-text">Settlement</span>
                        </span>
                      </li>



                      {(user_type == 'superadmin' || user_type == 'admin' || user_type == 'bat') ?
                      (
                      <li className={selectedMenu == 'Settlement Request' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>{setSelectedMenu('Settlement Request')}} to="/collection-settlement-request" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">
                            Settlement Request
                          </span>
                        </Link>
                        </li>) : <></>}




                        {(user_type == 'superadmin' || user_type == 'admin' || user_type == 'fi') ?
                      (<li className={selectedMenu == 'Settlement Requests' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Settlement Requests')} to="/fi-settlement-list" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">
                          Settlement Requests
                          </span>
                        </Link>
                      </li>) : <></>}



                      <li className={selectedMenu == 'Settlement History' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Settlement History')} to="/collection-settlement" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">
                            Settlement History
                          </span>
                        </Link>
                      </li>
                      {/*  <li className="menu-item" aria-haspopup="true">
                        <Link to="/settlement-confirmation" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Settlement Confirmation</span>
                        </Link>
                      </li> */}

                    </ul>
                  </div>
                </li>

          <li
                  onClick={()=>setSelectedParentMenu('Billing')}
                  className={selectedParentMenu == 'Billing' ? "menu-item menu-item-submenu menu-item-open" : "menu-item menu-item-submenu"}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <Link to="#" className="menu-link menu-toggle">
                    <span className="svg-icon menu-icon">
                      <Kyc />
                    </span>
                    <span className="menu-text">Billing</span>
                    <i className="menu-arrow" />
                  </Link>
                  <div className="menu-submenu">
                    <i className="menu-arrow" />
                    <ul className="menu-subnav">
                      <li
                        className="menu-item menu-item-parent"
                        aria-haspopup="true"
                      >
                        <span className="menu-link">
                          <span className="menu-text">Billing</span>
                        </span>
                      </li>

                      {(user_type == 'bat') ? (
                      <li className={selectedMenu == 'Bill Claim' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                      <Link onClick={()=>setSelectedMenu('Bill Claim')} to="/bill-claim" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Bill Claim</span>
                        </Link>
                      </li>) : <></>}
                        {(user_type == 'superadmin' || user_type == 'admin' || user_type == 'bat' || user_type == 'fi' || user_type == 'apsis_support') ? (
                        <li className={selectedMenu == 'Billing History' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Billing History')} to="/billing-history" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Billing History</span>
                        </Link></li>) : <></>}
                    </ul>
                  </div>
                </li>

                <li
                  onClick={()=>setSelectedParentMenu('Reports')}
                  className={selectedParentMenu == 'Reports' ? "menu-item menu-item-submenu menu-item-open" : "menu-item menu-item-submenu"}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <a href="javascript:;" className="menu-link menu-toggle">
                    <span className="svg-icon menu-icon">
                      <Reports />
                    </span>
                    <span className="menu-text">Reports</span>
                    <i className="menu-arrow" />
                  </a>
                  <div className="menu-submenu">
                    <i className="menu-arrow" />
                    <ul className="menu-subnav">
                      <li
                        className="menu-item menu-item-parent"
                        aria-haspopup="true"
                      >
                        <span className="menu-link">
                          <span className="menu-text">Reports</span>
                        </span>
                      </li>

                      <li className={selectedMenu == 'Credit Summary of Outlets' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Credit Summary of Outlets')} to="/credit-summary-of-outlets" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Credit Summary of Outlets</span>
                        </Link>
                      </li>
                      <li className={selectedMenu == 'Sales Report' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true" style={{display:"none"}}>
                        <Link onClick={()=>setSelectedMenu('Sales Report')} to="/sales-report" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Sales Report</span>
                        </Link>
                      </li>
                      <li className={selectedMenu == 'Disbursements' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Disbursements')} to="/disbursements" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Disbursements</span>
                        </Link>
                      </li>
                      <li className={selectedMenu == 'Payments' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Payments')} to="/payments" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Payments</span>
                        </Link>
                      </li>
                      <li className={selectedMenu == 'Customer Report' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Customer Report')} to="/customer-report" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Customer Report</span>
                        </Link>
                      </li>
                      <li className={selectedMenu == 'Registration Information' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Registration Information')} to="/registration-information" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Registration Information</span>
                        </Link>
                      </li>
                      <li style={{display: 'none' }} className={selectedMenu == 'credit-information' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('credit-information')} to="/credit-information" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Credit Information</span>
                        </Link>
                      </li>
                      <li style={{display: 'none' }} className={selectedMenu == 'credit-information-by-outlet' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('credit-information-by-outlet')} to="/credit-information-by-outlet" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Credit Information by Outlet</span>
                        </Link>
                      </li>
                      <li className={selectedMenu == 'bad-debts-outlets' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('bad-debts-outlets')} to="/bad-debts-outlets" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Bad Debts Outlets</span>
                        </Link>
                      </li>
                      <li className={selectedMenu == 'payment-made-by-dh-to-fi' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('payment-made-by-dh-to-fi')} to="/payment-made-by-dh-to-fi" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Payments Made By Dh To Fi</span>
                        </Link>
                      </li>
                      {/* <li className={selectedMenu == 'total-credit-memo-vs-payments' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('total-credit-memo-vs-payments')} to="/total-credit-memo-vs-payments" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Total Credit Memo vs Payments</span>
                        </Link>
                      </li> */}
                      {(user_type == 'superadmin' || user_type == 'admin') ? (<li className={selectedMenu == 'outlet-wise-credit-info' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('outlet-wise-credit-info')} to="/outlet-wise-credit-info" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Outlet Wise Credit Info</span>
                        </Link>
                      </li>) : <></>}
                      <li className={selectedMenu == 'repayment-day-report' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('repayment-day-report')} to="/repayment-day-report" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Repayment Day Report</span>
                        </Link>
                      </li>
                      {/*
                              <li className={selectedMenu == 'payments-outlet-wise' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                                <Link onClick={()=>setSelectedMenu('payments-outlet-wise')} to="/payments-outlet-wise" className="menu-link">
                                  <i className="menu-bullet menu-bullet-dot">
                                    <span />
                                  </i>
                                  <span className="menu-text">Payments Outlet Wise</span>
                                </Link>
                              </li>
                              <li className={selectedMenu == 'commissions' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                                <Link onClick={()=>setSelectedMenu('commissions')} to="/commissions" className="menu-link">
                                  <i className="menu-bullet menu-bullet-dot">
                                    <span />
                                  </i>
                                  <span className="menu-text">Commissions</span>
                                </Link>
                              </li>
                      */}
                      {(user_type == 'superadmin' || user_type == 'fi' || user_type == 'apsis_support') ? (
                      <li className={selectedMenu == 'Outstanding Report' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                                <Link onClick={()=>setSelectedMenu('Outstanding Report')} to="/outstanding-report" className="menu-link">
                                  <i className="menu-bullet menu-bullet-dot">
                                    <span />
                                  </i>
                                  <span className="menu-text">Outstanding Report</span>
                                </Link>
                              </li>
                      ) : <></>}

                      {(user_type == 'superadmin' || user_type == 'admin' || user_type == 'bat' || user_type == 'fi' || user_type == 'apsis_support') ? (
                      <li className={selectedMenu == 'eKYC-report' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('eKYC-report')} to="/eKYC-report" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">eKYC Report</span>
                        </Link>
                      </li>) : <></>}

                      {(user_type == 'superadmin' && user_id == 200) ? (
                        <li className={selectedMenu == 'loan-loss-outstanding' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                          <Link onClick={()=>setSelectedMenu('loan-loss-outstanding')} to="/loan-loss-outstanding" className="menu-link">
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">Loan Loss Outstanding</span>
                          </Link>
                        </li>) : <></>
                      }

                      {(user_type == 'superadmin' && user_id == 200) ? (
                        <li className={selectedMenu == 'summary-of-loan-loss-outstanding' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                          <Link onClick={()=>setSelectedMenu('summary-of-loan-loss-outstanding')} to="/summary-of-loan-loss-outstanding" className="menu-link">
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">Summary Of Loan loss Outstanding</span>
                          </Link>
                        </li>) : <></>
                      }
                    </ul>
                  </div>
                </li>
                {(user_type == 'superadmin' && cr_setting_menu == 'Yes') ? (
                <li
                  onClick={()=>setSelectedParentMenu('Settings')}
                  className={selectedParentMenu == 'Settings' ? "menu-item menu-item-submenu menu-item-open" : "menu-item menu-item-submenu"}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <a href="javascript:;" className="menu-link menu-toggle">
                    <span className="svg-icon menu-icon">
                      <Setting />
                    </span>
                    <span className="menu-text">Settings</span>
                    <i className="menu-arrow" />
                  </a>
                  <div className="menu-submenu">
                    <i className="menu-arrow" />
                    <ul className="menu-subnav">
                      <li
                        className="menu-item menu-item-parent"
                        aria-haspopup="true"
                      >
                        <span className="menu-link">
                          <span className="menu-text">Settings</span>
                        </span>
                      </li>
                      <li className={selectedMenu == 'Cr Limit Config' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Cr Limit Config')} to="/cr-limit-config" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Cr Limit Config</span>
                        </Link>
                      </li>
                      <li className={selectedMenu == 'DH-FI Mapping' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('DH-FI Mapping')} to="/dh-fi-mapping" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">DH-FI Mapping</span>
                        </Link>
                      </li>
                      <li className={selectedMenu == 'FI Information' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('FI Information')} to="/fi-information" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">FI Information</span>
                        </Link>
                      </li>
                      <li className={selectedMenu == 'Interest Settings' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Interest Settings')} to="/insert-interest-settings" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Interest Settings</span>
                        </Link>
                      </li>
                      {/* <li className={selectedMenu == 'Update Retailer Contact No.' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Update Retailer Contact No.')} to="/update-retailer-contact-no" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Update Retailer Contact No.</span>
                        </Link>
                      </li> */}
                      <li className={selectedMenu == 'Fi-Doc Mapping' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Fi-Doc Mapping')} to="/fi-document-mapping" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Fi-Doc Mapping</span>
                        </Link>
                      </li>
                      <li className={selectedMenu == 'User' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('User')} to="/user" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">User</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>): <></>}
                {(user_type == 'apsis_support') ? (
                <li
                  onClick={()=>setSelectedParentMenu('Support')}
                  className={selectedParentMenu == 'Support' ? "menu-item menu-item-submenu menu-item-open" : "menu-item menu-item-submenu"}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <a href="javascript:;" className="menu-link menu-toggle">
                    <span className="svg-icon menu-icon">
                      <Setting />
                    </span>
                    <span className="menu-text">Support</span>
                    <i className="menu-arrow" />
                  </a>
                  <div className="menu-submenu">
                    <i className="menu-arrow" />
                    <ul className="menu-subnav">
                      <li
                        className="menu-item menu-item-parent"
                        aria-haspopup="true"
                      >
                        <span className="menu-link">
                          <span className="menu-text">Support</span>
                        </span>
                      </li>
                      <li className={selectedMenu == 'Credit Outlet Info' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Credit Outlet Info')} to="/support-credit-outlet" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Credit Outlet Info</span>
                        </Link>
                      </li>
                      <li className={selectedMenu == 'Demo Outlets' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Demo Outlets')} to="/support-outlet" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Demo Outlets</span>
                        </Link>
                      </li>
                      <li className={selectedMenu == 'Credit Adjustment' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Credit Adjustment')} to="" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Credit Adjustment</span>
                        </Link>
                      </li>
                      <li className={selectedMenu == 'Payment Adjustment' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Payment Adjustment')} to="" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Payment Adjustment</span>
                        </Link>
                      </li>
                      <li className={selectedMenu == 'OTP Log' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('OTP Log')} to="/support-otp-log" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">OTP Log</span>
                        </Link>
                      </li>
                      <li className={selectedMenu == 'Sms Gateway' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Sms Gateway')} to="support-sms-gateway-selection" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Sms Gateway</span>
                        </Link>
                      </li>
                      <li className={selectedMenu == 'Update Retailer Contact No.' ? "menu-item menu-item-active" : "menu-item"} aria-haspopup="true">
                        <Link onClick={()=>setSelectedMenu('Update Retailer Contact No.')} to="/update-retailer-contact-no" className="menu-link">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Update Retailer Contact No.</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>): <></>}
              </ul>

              <div className={`${styles.logoutBtnWrapper} logoutBtnMenu`}>
                <button
                  className={`btn btn-sm ${styles.btnWrapper} logOutButton`}
                  color='primary'
                  onClick={handleLogoutBtn}
                >
                  <i className="fa fa-sign-out-alt" style={{color: 'white'}}></i>
                  <div>Sign Out</div>
                </button>
              </div>
              {/*end::Menu Nav*/}
            </div>
            {/*end::Menu Container*/}
          </div>
          {/*end::Aside Menu*/}
        </div>
      }
    </>

  );
}

export default SideBar;
