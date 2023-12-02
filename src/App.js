import logo from "./logo.svg";
import "./App.css";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import auth from "./services/authService";
import Root from "./components/common/Root";
import LoginCheckRoute from "./components/common/loginCheckRoute";
import ProtectedRoute from "./components/common/protectedRoute";
import Footer from "./components/common/footer";
import Myprofile from "./components/common/Myprofile";
import SideBar from "./components/sideBar";
import Login from "./components/login";
import TopBar from "./components/topBar";
import FiPortal from "./components/Fi-portal/fiPortal";
import HeaderMobile from "./components/headerMobile";
import KycList from "./components/Kyc-list/kycList";
import KycListDh from "./components/Kyc-list/kycListDh";
import CreditUpload from "./components/File_Components/CreditUpload";
import CreditPreview from "./components/File_Components/CreditPreview";
import CreditPreviewFi from "./components/File_Components/CreditPreviewFi";
import ScopeOutletPreview from "./components/File_Components/ScopeOutletPreview";
import ScopeOutletPreviewFi from "./components/File_Components/ScopeOutletPreviewFi";
import CreditDisburse from "./components/credit/CreditDisburse";
import CollectionSettlementHistory from "./components/settlement/CollectionSettlementHistory";
import CollectionSettlementRequest from "./components/settlement/CollectionSettlementRequest";
import SettlementConfirmation from "./components/settlement/SettlementConfirmation";
/* import RaisedIssueList from "./components/credit-issues/raisedIssueList"; */
import FiDisbursementHistory from "./components/disbursement-history/FIdisbursementHistory";
import FiDocumentMapping from "./components/Fi-portal/FiDocumentMapping";
import RaisedIssue from "./components/credit-issues/raisedIssueList";
import FiCollectionSettlementHistory from "./components/settlement/FiCollectionSettlementHistory";
import DhPortal from "./components/Dh-portal/dhPortal";
import CrLimitConfig from "./components/credit/cr_limit_config/crLimitConfig";
import KycWithoutDoc from "./components/Kyc-list/kycWithoutDoc";
import KycDocSubmitted from "./components/Kyc-list/KycDocSubmitted";
import FiApproved from "./components/Kyc-list/FiApproved";
import KycRejected from "./components/Kyc-list/kycRejected";
import InsertInterestSettings from "./components/interest_settings/insert_interest_settings";
import ConfirmedLimits from "./components/credit/confirmed_limits/ConfirmedLimits";
import Disbursement from "./components/disbursement/Disbursement";
import DhDisbursementHistory from "./components/disbursement-history/DhDisbursementHistory";
import CreditDisburseRequest from "./components/credit/CreditDisburseRequest";
import CreditSummeryOfOutletsReport from "./components/Reports/CreditSummeryOfOutletsReport";
import SalesReport from "./components/Reports/SalesReport";
import Disbursements from "./components/Reports/Disbursements";
import Payments from "./components/Reports/Payments";
import User from "./components/Admin/User";
import Dashboard from "./components/Dashboard/Dashboard";
import DashboardV2 from "./components/DashBoardV2/DashboardV2";
import DashboardV3 from "./components/DashBoardV3/DashboardV3";
import RegInfoReport from "./components/Reports/RegInfoReport";
import CreditInfoReport from "./components/Reports/CreditInfoReport";
import CreditInfoReportByOutlet from "./components/Reports/CreditInfoReportByOutlet";
import BadDebtsOutlets from "./components/Reports/BadDebtsOutlets";
import PaymentMadeByDhToFi from "./components/Reports/PaymentMadeByDhToFi";
import TotalCreditMemoVsPayments from "./components/Reports/TotalCreditMemoVsPayments";
import OutletWiseCreditInfo from "./components/Reports/OutletWiseCreditInfo";
import RepaymentDayReport from "./components/Reports/RepaymentDayReport";
import BillClaim from "./components/billing/BillClaim";
import BillHistory from './components/billing/BillHistory';
import UploadReviewCredits from './components/credit/uploadReviewCredit';
import SupportOutlet from './components/support/SupportOutlet';
import SupportCreditOutlet from './components/support/SupportCreditOutlet';
import SupportOtpLog from './components/support/SupportOtpLog';
import eKYC from './components/Kyc-list/eKYC-list';
import bulkKYCApprove from './components/Kyc-list/bulkKYCUpload';
import Leaderboard from './components/leaderboard/leaderboard.js';
import OutstandingReport from './components/Reports/OutstandingReport';
import retailerInfoUpload from './components/Kyc-list/retailerInfoUpload';
import './fonts/Nimbus/Nimbus.otf';
import LoanAccountAndClientId from './components/Kyc-list/loanAccountAndClientId';
import NationalLaunch from './components/national-launch/NationalLaunch';
import CommonLogin from './components/CommonLogin';
import CustomerReport from './components/Reports/CustomerReport';
import smsGatewaySelection from './components/support/SmsGatewaySelection';
import eKYCReport from './components/Reports/eKYCReport.js';
import UpdateOutletPhone from "./components/update_phone/UpdateOutletPhone";
import OutstandingLoanLossReport from './components/Reports/OutletLoanLossReport';
import SummaryOutstandingLoanLossReport from './components/Reports/SummaryOutletLoanLossReport';

//const Dashboard = lazy(() => import("./components/Dashboard/Dashboard"));

//const FiPortal = lazy(() => import("./components/Fi-portal/fiPortal"));
/* const SideBar = lazy(() => import("./components/sideBar"));
const TopBar = lazy(() => import("./components/topBar")); */
import { baseURL } from "./constants/constants";
import axios from "axios";
const verifyTokenURL = baseURL+'verify-token';

function App() {
  const [user, setUser] = useState();
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const user = auth.getCurrentUser();
    setUser(user);
  }, []);

  // useEffect(async () => {
  //   const token = localStorage.getItem('token');

  //   const config = {
  //     headers: {
  //         Authorization: `Bearer ${token}`
  //     },
  //   };

  //   try {
  //     let verified = await axios.post(verifyTokenURL, null, config);
  //     if (verified?.data?.message === 'Verified') {
  //       setShowSidebar(true)
  //     } else if (verified?.data?.message === 'Forbidden') {
  //       localStorage.removeItem('token')
  //       setShowSidebar(false)
  //     }
  //   } catch (error) {
  //     localStorage.removeItem('token')
  //     setShowSidebar(false)
  //   }
  // }, [])

  return (
    <div className="App">
    <Suspense fallback={<div>Loading...</div>}>
    <HeaderMobile />
    <LoginCheckRoute path="/login" component={Login} />
    <Route path="/common_login" exact component={CommonLogin} />
    <div className="d-flex flex-column flex-root">
    <div className="d-flex flex-row flex-column-fluid page">
      {user && <SideBar />}
    <div
    className="d-flex flex-column flex-row-fluid wrapper"
    id="kt_wrapper"
    >
    {user && <TopBar />}
    <Switch>
    <ProtectedRoute path="/sample" component={Disbursement} />
    <ProtectedRoute
    path="/fi-disbursement-history"
    component={FiDisbursementHistory}
    />
    <ProtectedRoute path="/dashboard" component={Dashboard} />
    <ProtectedRoute path="/dashboard_v2" component={DashboardV2} />
    <ProtectedRoute path="/dashboard_v3" component={DashboardV3} />
    <ProtectedRoute
    path="/cr-limit-config"
    component={CrLimitConfig}
    />
    <ProtectedRoute
    path="/confirmed-limits"
    component={ConfirmedLimits}
    />
    <ProtectedRoute
    path="/credit-disburse"
    component={CreditDisburse}
    />
    <ProtectedRoute
    path="/credit-disbursement-request"
    component={CreditDisburseRequest}
    />
    <ProtectedRoute
    path="/collection-settlement"
    component={CollectionSettlementHistory}
    />
    <ProtectedRoute
    path="/collection-settlement-request"
    component={CollectionSettlementRequest}
    />
    <ProtectedRoute
    path="/settlement-confirmation"
    component={SettlementConfirmation}
    />

    <ProtectedRoute path="/dh-fi-mapping" component={DhPortal} />
    <ProtectedRoute path="/fi-information" component={FiPortal} />
    <ProtectedRoute path="/fi-document-mapping" component={FiDocumentMapping} />
    <ProtectedRoute
    exact
    path="/credit-upload"
    component={CreditUpload}
    />
    <ProtectedRoute
    exact
    path="/credit-preview"
    component={CreditPreview}
    />
    <ProtectedRoute
    exact
    path="/credit-preview-fi"
    component={CreditPreviewFi}
    />
    <ProtectedRoute
    exact
    path="/scope-outlet-preview"
    component={ScopeOutletPreview}
    />

    <ProtectedRoute
    exact
    path="/scope-outlet-preview-fi"
    component={ScopeOutletPreviewFi}
    />

    <ProtectedRoute
      exact
      path="/loan-account-and-client-id"
      component={LoanAccountAndClientId}
    />

    <ProtectedRoute path="/kyc-list" component={KycList} />
    <ProtectedRoute path="/kyc-list-dh" component={KycListDh} />

                {/* <ProtectedRoute
                  exact
                  path="/credit-upload"
                  component={CreditUpload}
                />
                <ProtectedRoute
                  exact
                  path="/credit-preview"
                  component={CreditPreview}
                /> */}
                <ProtectedRoute
                exact
                path="/kyc-without-docs"
                component={KycWithoutDoc}
                />
                <ProtectedRoute
                exact
                path="/kyc-doc-submitted"
                component={KycDocSubmitted}
                />
                <ProtectedRoute
                exact
                path="/kyc-rejected"
                component={KycRejected}
                />
				<ProtectedRoute
                  exact
                  path="/ekyc-list"
                  component={eKYC}
                />
                <ProtectedRoute
                exact
                path="/fi-approved"
                component={FiApproved}
                />
                <ProtectedRoute
                exact
                path="/insert-interest-settings"
                component={InsertInterestSettings}
                />
                <ProtectedRoute
                  exact
                  path="/update-retailer-contact-no"
                  component={UpdateOutletPhone}
                />
                <ProtectedRoute
                exact
                path="/kyc-without-docs"
                component={KycWithoutDoc}
                />
                <ProtectedRoute
                exact
                path="/insert-interest-settings"
                component={InsertInterestSettings}
                />
                {/* <ProtectedRoute
                  exact
                  path="/raised-issues"
                  component={RaisedIssueList}
                /> */}
                <ProtectedRoute
                exact
                path="/fi-disbursement-history"
                component={FiDisbursementHistory}
                />

                <ProtectedRoute
                exact
                path="/dh-disbursement-history"
                component={DhDisbursementHistory}
                />

                <ProtectedRoute
                exact
                path="/issue-list"
                component={RaisedIssue}
                />

                <ProtectedRoute
                exact
                path="/fi-settlement-list"
                component={FiCollectionSettlementHistory}
                />

                <ProtectedRoute path="/myProfile" component={Myprofile} />
                <ProtectedRoute path="/credit-summary-of-outlets" component={CreditSummeryOfOutletsReport} />
                <ProtectedRoute path="/sales-report" component={SalesReport} />
                <ProtectedRoute path="/disbursements" component={Disbursements} />
                <ProtectedRoute path="/payments" component={Payments} />
                <ProtectedRoute path="/user" component={User} />
                <ProtectedRoute path="/registration-information" component={RegInfoReport} />
                <ProtectedRoute path="/credit-information" component={CreditInfoReport} />
                <ProtectedRoute path="/credit-information-by-outlet" component={CreditInfoReportByOutlet} />
                <ProtectedRoute path="/bad-debts-outlets" component={BadDebtsOutlets} />
                <ProtectedRoute path="/payment-made-by-dh-to-fi" component={PaymentMadeByDhToFi} />TotalCreditMemoVsPayments
                <ProtectedRoute path="/total-credit-memo-vs-payments" component={TotalCreditMemoVsPayments} />
                <ProtectedRoute path="/outlet-wise-credit-info" component={OutletWiseCreditInfo} />
                <ProtectedRoute path="/repayment-day-report" component={RepaymentDayReport} />
				        <ProtectedRoute path="/outstanding-report" component={OutstandingReport} />
                <ProtectedRoute path="/customer-report" component={CustomerReport} />
                <ProtectedRoute exact path="/eKYC-report" component={eKYCReport} />
                <ProtectedRoute path="/loan-loss-outstanding" component={OutstandingLoanLossReport} />
                <ProtectedRoute path="/summary-of-loan-loss-outstanding" component={SummaryOutstandingLoanLossReport} />

                <ProtectedRoute exact path="/bill-claim" component={BillClaim} />
                <ProtectedRoute exact path="/billing-history" component={BillHistory} />

                <ProtectedRoute exact path="/upload-review-credits" component={UploadReviewCredits} />

				        <ProtectedRoute exact path="/support-outlet" component={SupportOutlet} />
                <ProtectedRoute exact path="/support-credit-outlet" component={SupportCreditOutlet} />
				        <ProtectedRoute exact path="/support-otp-log" component={SupportOtpLog} />
                <ProtectedRoute exact path="/support-sms-gateway-selection" component={smsGatewaySelection} />
                <ProtectedRoute exact path="/bulk-kyc-approve" component={bulkKYCApprove} />
				        <ProtectedRoute exact path="/leaderboard" component={Leaderboard} />


                {/* <ProtectedRoute exact path="/national-launch-update" component={NationalLaunch} /> */}

				        <ProtectedRoute exact path="/retailer-information-upload" component={retailerInfoUpload} />
                <Route path="/" exact component={Root} />
                </Switch>
              {/*<Footer />*/}
              </div>
              </div>
              </div>
              </Suspense>
              </div>
              );
}

export default App;
