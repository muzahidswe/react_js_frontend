import React, { Fragment, useEffect, useState } from "react";
import {
  downLoadNidOutlet,
  downLoadNidHouse,
  previewNidOutlet,
  uploadZip,
  getOutletBasedOnDocUpload,
  downloadExcelFileFromService,
  getCounter
} from "../../services/kyc-list-service";
import { getKyc } from "../../services/fiPortalService";
import DataTable from "react-data-table-component";
import FileSaver from "file-saver";
import { apiUrl } from "../../config.json";
import {
  accountFormUrl,
  nidImageBaseUrl,
  baseURL,
} from "../../constants/constants";
/* import { ToastContainer, toast } from "react-toastify"; */
import ModalForm from "../common/modalForm";
import { Link } from "react-router-dom";
import FormInputSingleFile from "../common/formInputSingleFile";
import Loader from "react-loader-spinner";
import DropdownMenuGroup from "../helper/top_dropdown_with_phase";
import FormFileInput from "react-bootstrap/esm/FormFileInput";
import { useAlert } from "react-alert";
import { Card } from "react-bootstrap";
import { Tab, Tabs } from "react-bootstrap";
import UserDetails from "./userDetails";
import swal from 'sweetalert';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const columns = [
  {
    name: "Actions",
    selector: "actions",
    center: "true",
    width: "250px",
    sortable: false,
  },

//   {
//     name: "Region",
//     selector: "region",
//     sortable: true,
//   },
//   {
//     name: "Area",
//     selector: "area",
//     grow: 2,
//     sortable: true,
//   },
    {
      name: "KYC Status",
      selector: "kyc_status",
      sortable: true
    },
  {
    name: "House",
    selector: "house",
    grow: 5,
    sortable: true,
  },
//   {
//     name: "Territory",
//     selector: "territory",
//     sortable: true,
//   },
  {
    name: "Point",
    selector: "point",
    sortable: true,
  },
  {
    name: "Outlet Code",
    selector: "outlet_code",
    grow: 5,
    sortable: true,
  },
  {
    name: "Outlet Name",
    selector: "outlet_name",
    grow: 5,
    sortable: true,
  },
  {
    name: "Owner Name",
    selector: "owner_name",
    sortable: true,
  },
  {
    name: "Phone",
    selector: "phone",
    grow: 5,
    sortable: true,
  },
  {
    name: "Address",
    selector: "address",
    sortable: true,
  }
];

let styles = {
  "marginTop": "40px",
  width: "150px",
  height: "100px",
};

const FilterComponent = ({ filterText, onFilter, searchClick }) => (
  <>
    {/* <TextField
      id="search"
      type="text"
      placeholder="Search"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    /> */}

    <Paper style={{
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 300,
    }}>

      <InputBase
        style={{
          marginLeft: 8,
          flex: 1,
        }}
        placeholder="Search By Outlet Code"
        inputProps={{ 'aria-label': 'Search By Outlet Code' }}
        value={filterText}
        onChange={onFilter}
      />
      <Divider style={{
        width: 1,
        height: 28,
        margin: 4,
      }} />
      <IconButton style={{ padding: 10, }} aria-label="Search" onClick={searchClick}>
        <SearchIcon />
      </IconButton>

    </Paper>
  </>
);



function KycListDh(props) {
  const toast = useAlert();
  const [zip, setZip] = useState();
  let [pageCounter, setPageCounter] = useState(1);
  const [totaRows, setTotalRows] = useState(0);
  let [column, setColumn] = useState(columns);
  const [preveiw, setPreview] = useState(false);
  const [modal, setModal] = useState(false);
  const [onUpload, setOnUpload] = useState(false);
  const [nidImages, setNidImages] = useState();
  const [accountFormImage, setAccountFormImage] = useState();
  const [isNid, setIsNid] = useState(false);
  const [isAccForm, setIsAccForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [axiosLoading, setAxiosLoading] = useState(false);
  const [isViewUserDetails, setIsViewUserDetails] = useState(false);
  const [userDetails, setUserDetails] = useState("");
  const [dpids, setDpids] = useState([]);
  const [totalOutlet, setTotalOutlet] = useState(0);
  const [docOutlet, setDocOutlet] = useState(0);
  const [nonDocOutlet, setNonDocOutlet] = useState(0);
  const [accountForm, setAccountForm] = useState(2);
  const [singleAccountFormUpload,setSingleAccountFormUpload] = useState(false);
  const [accountFormUploadedRow,setAccountFormUploadedRow] = useState();
  const [filterText, setFilterText] = React.useState("");
  const [currentHouseRow, setCurrentHouseRow] = useState();
  const [phases, setPhases] = useState([]);

  /*   let [tableData, setTableData] = useState({
    columns: [],
    rows: [],
  }); */
  const [rows, setRows] = useState([]);

  const toggle = () => setModal(!modal);
  const addButton = (rowData) => {
    const rows = rowData.map((row) => {
      row.actions = (
        <Fragment>
          <Link
            className="btn btn-sm btn-clean btn-icon"
            onClick={() => handleUserDetails(row)}
            data-toggle="tooltip"
            data-placement="bottom"
            title="user details"
          >
            <i class="fas fa-user-alt" />
          </Link>{" "}
          <Link
            className="btn btn-sm btn-clean btn-icon"
            onClick={() => handleDownload(row)}
            data-toggle="tooltip"
            data-placement="bottom"
            title="Download"
          >
            <i class=" flaticon-download"></i>
          </Link>{" "}
          
          <Link
            className="btn btn-sm btn-clean btn-icon"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Preview NID"
            onClick={() => handlePreviewNid(row)}
          >
            <i className="la la-image"></i>
          </Link>
          
        </Fragment>
      );
      return row;
    });
    return rows;
  };
  const handleChange = (event) => setZip(event.target.files[0]);

  const handleSubmit = async () => {
    try {
      const form = new FormData();
      form.append("file", zip);
      const status = await uploadZip(form);
      toggle();
      if(status == null){
        toast.error("Could not upload Account Form");
      }
      else{

        toast.success("Account Form Uploaded Successfully");
  
        window.location.reload(); 
      }
     
    } catch (error) {
      toast.error(error.message);
    }
  };
  const changeRowAccountForm = (updated_outlet_codes)=>{
    var tempRows= [...rows];
    var tempTempRows = tempRows.map((tempRow)=>{
     if(updated_outlet_codes.indexOf(tempRow.outlet_code)!==-1){
       tempRow.is_account_form_uploaded = "Yes";
     }

     return tempRow;
    });
    setRows([tempTempRows[0]]);
  }
  const handleUserDetails = (row) => {
    setUserDetails(row);
    setPreview(false);
    setIsViewUserDetails(true);
    toggle();
  };

  const handleDownload = async (row) => {
    try {
      setAxiosLoading(true);
      const zipLink = await downLoadNidOutlet(row.outlet_code);
      if (typeof zipLink !== "string") throw new Error("No file to download");
      //FileSaver.saveAs(zipLink, row.outlet_code);
      openInNewTab(zipLink);
      setAxiosLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null
  }
  const handleSingleAccountFormUpload = async(row)=>{
    setUserDetails(false);
    setPreview(false);
   
    setOnUpload(false);
    setAccountFormUploadedRow(row)
    setSingleAccountFormUpload(true);
    setCurrentHouseRow(row);
    toggle();
  };
  const handleDownloadAllFile = async () => {
    try {
      swal({
        icon: "load.gif",
        buttons: false,
    });

      const zipLink = await downLoadNidHouse(dpids);
      if (typeof zipLink !== "string") throw new Error("No file to download");
      //FileSaver.saveAs(zipLink, "allFile");
      openInNewTab(zipLink);
      swal.close();
    } catch (error) {
      toast.error(error.message);
      swal.close();
    }    
  };

  const downloadExcelFile = async () => {
    try {
      swal({
        icon: "load.gif",
        buttons: false,
      });
      const downloadExcel = await downloadExcelFileFromService(dpids, phases);

      if (downloadExcel == null) {
        toast.error("Could not download Excel");
      } else {
        // FileSaver.saveAs(downloadExcel, "Kyc List");

        let link = window.document.createElement("a");
        link.setAttribute("href", `${downloadExcel}`);
        link.setAttribute("download", 'Kyc List');
        link.click();
      }
    } catch (error) {
      toast.error(error.message);
    }
    swal.close();
  }

  const handlePreviewAccountForm = (row) => {
    if (!row.account_form) return; //do alert
    const [image1, image2] = row.account_form.split(",");
    const accountFormImage = {
      image1,
      image2,
    };

    setAccountFormImage(accountFormImage);
    setIsViewUserDetails(false);
    setIsNid(false);
    setSingleAccountFormUpload(false);
    setIsAccForm(true);
    setPreview(true);
    toggle();
  };
  const handlePreviewNid = async (row) => {
    try {
        setAxiosLoading(true);
      setCurrentHouseRow(row);
      const nid_image_array = await previewNidOutlet(row.id_outlet);

      if (!Object.keys(nid_image_array).length){
        setAxiosLoading(false);
        throw new Error("No data Found");
      }

      for (let i = 0; i < nid_image_array.length; i++) {
          const element = nid_image_array[i];
          if (element.doc_title == 'nid-own') {
             var [ownFront, ownBack] = element.attachment_base64.split(",");
          }
          if (element.doc_title == 'nid-nominee') {
             var [nomineeFront, nomineeBack] = element.attachment_base64.split(","); 
          }
      }
    //   const [ownFront, ownBack] = nid_image_array[1]?.attachment.split(",");
    //   const [nomineeFront, nomineeBack] = nid_image_array[0]?.attachment.split(",");

      const imageObj = {
        own_nid_front: ownFront,
        own_nid_back: ownBack,
        nominee_nid_front: nomineeFront,
        nominee_nid_back: nomineeBack,
      };

      setNidImages(imageObj);
      setOnUpload(false);
      setIsViewUserDetails(false);
      setIsAccForm(false);
      setSingleAccountFormUpload(false);
      setIsNid(true);
      setPreview(true);      
      toggle();
      setAxiosLoading(false);
    } catch (error) {
      toast.error(error.message);
      console.log("preview nid error ", error);
    }
  };

  const handleUploadAccForm = () => {
    setUserDetails(false);
    setPreview(false);
    setSingleAccountFormUpload(false);
    setOnUpload(true);
    
    toggle();
  };

  async function getInitialContent() {
    if ((dpids.length > 0) && (phases.length > 0)) {
      const requestObject = {
        dpids,
        phases,
        per_page: 10,
        search_text: filterText,
        current_page: pageCounter,
      };
      const data = await getKyc(requestObject);

      if (data && data?.result.length) {
        const dynamicColumn = data.result[0].doc_info.map((doc) => {
          let cl = {};
          cl.center = "true";
          cl.name = doc.title;
          cl.selector = `${doc.id}_checked`;
          return cl;
        });

        const new_list = data.result.map((res) => {
          res.doc_info.map((doc) => {
            res[`${doc.id}_checked`] = doc.checked;
          });
          delete res.doc_info;
          return res;
        });

        /*  dynamicColumn.push({
          name: "Actions",
          selector: "actions",
          sortable: true,
        }); */

        const rows = addButton(new_list);

        setTotalRows(data["pagination"].total);
        setColumn([...columns, ...dynamicColumn]);
        setRows([...rows]);

      } else {
        setColumn([...columns]);
        setRows([]);
      }
      setIsLoading(false);
    }
      
  }

  const searchClick = () => {
    getInitialContent();
  }

  const subHeader = React.useMemo(() => {
    return (
      <>
      <Fragment>
            <FilterComponent
            searchClick={searchClick}
            onFilter={(e) => {
                setFilterText(e.target.value)

            }}
            filterText={filterText}
            />
        </Fragment>

      <Fragment>
        <button className="btn btn-info m-2" onClick={handleDownloadAllFile}>
          Download Attachments
        </button>
        <button className="btn btn-success m-2" onClick={downloadExcelFile}>Download Excel</button>
      </Fragment>
      </>
    );
  }, [filterText, dpids, phases]);

  const handleDpidChange = (ids) => {
    setDpids(ids);
  };

  const handlePhaseChange = (ids) => {
    setPhases(ids);
  };

  useEffect(() => {
    getInitialContent();
  }, [dpids, phases, pageCounter]);

  const [totalPending, setTotalPending] = useState(0);
  const [totalApproved, setTotalApproved] = useState(0);
  const [totalRejected, setTotalRejected] = useState(0);
  const [scopedOutlet, setScopedOutlet] = useState(0);
  const [totalOutlets, setTotalOutlets] = useState(0);
  const [docSubmitted, setDocSubmitted] = useState(0);
  const [totalLoanApproved, setTotalLoanApproved] = useState(0);

  useEffect(async () => {
    if (dpids.length > 0) {
      const data = await getOutletBasedOnDocUpload(dpids);
      if (data != null) {
        const tempTotal = data.all_oultet;
        const tempDoc = data.doc_outlet;
        const tempNonDoc = data.non_doc_outlet;
        const tempTotalLoanApproved = data.loan_approved;

        setTotalOutlet(tempTotal);
        setDocOutlet(tempDoc);
        setNonDocOutlet(tempNonDoc);
        setAccountForm(tempDoc);
        setTotalLoanApproved(tempTotalLoanApproved)
      } else {
        toast.error("Some Error Occurred");
      }

      const counter = await getCounter(dpids);
      //const counter = null;
      if (counter != null) {
        const totalPending = counter.Pending;
        const totalApproved = counter.Approved;
        const totalRejected = counter.Rejected;
        const scopedOutlet = counter.Scoped_Outlet;
        const docSubmitted = counter.Doc_Submitted;
        const totalOutlets = counter.Pending+counter.Approved+counter.Rejected+counter.Scoped_Outlet;

        setTotalPending(totalPending);
        setTotalApproved(totalApproved);
        setTotalRejected(totalRejected);
        setScopedOutlet(scopedOutlet);
        setTotalOutlets(totalOutlets);
        setDocSubmitted(docSubmitted);
      } else {
        //toast.error("Some Error Occurred");
      }
    };
  }, [dpids]);

  return (
    <div className="card px-10 m-5" style={{ minHeight: "85vh" }}>
      {/* <ToastContainer /> */}
      {axiosLoading ? (
        <div>
            <div style={{ textAlign: "center", position: "absolute", top: "50%", left: "50%", "zIndex": "1000" }}>
            <Loader type="Rings" color="#00BFFF" height={100} width={100} />
            </div>
        </div>) : <></>
        }
      <br />
      <h2 className="d-flex justify-content">KYC History</h2>
      <br />
      <DropdownMenuGroup onDpidChange={handleDpidChange} onPhaseChange={handlePhaseChange} isSearch={true} />

      {/* <div className="row" style={{"display": "none"}}>
        <OutletBox
          className="col-md-3"
          label="Total Outlets"
          count={totalOutlets}
          backGroundColor="bg-light-primary"
        />
        <OutletBox
          className="col-md-3"
          label="Total Pending"
          count={totalPending}
          backGroundColor="bg-light-primary"
        />
        <OutletBox
          className="col-md-3"
          label="Total Approved"
          count={totalApproved}
          backGroundColor="bg-light-primary"
        />
        <OutletBox
          className="col-md-3"
          label="Total Rejected"
          count={totalRejected}
          backGroundColor="bg-light-primary"
        />
        <OutletBox
          className="col-md-3"
          label="Scoped Outlet"
          count={scopedOutlet}
          backGroundColor="bg-light-primary"
        />
      </div> */}

      <div className="row">

            {/* <OutletBox className="col-md-3" label="Total Outlets" count={totalOutlet} backGroundColor="bg-light-primary" />
        <OutletBox className="col-md-3" label="Doc Uploaded" count={docOutlet} backGroundColor="bg-light-success" />
        <Link to="/kyc-without-docs"> <OutletBox className="col-md-3" label="Outlet Without KYC" count={nonDocOutlet} backGroundColor="bg-light-danger" /> </Link>
        <OutletBox className="col-md-3" label="Account Form Uploaded" count={accountForm} backGroundColor="bg-light-info" /> */}
        <div className="col-2">
            <OutletBox
            className="col-md-3"
            label="Total Outlets"
            count={totalOutlet}
            backGroundColor="bg-light-primary"
            />
        </div>
        
        {/*<OutletBox
            className="col-md-2"
            label="SS KYC Done"
            count={docOutlet}
            backGroundColor="bg-light-success"
        />*/}
        <div className="col-2">
            <Link to="/kyc-without-docs">
            {" "}
            <OutletBox
                className="col-md-3"
                label="Pending"
                count={nonDocOutlet}
                backGroundColor="bg-light-info"
            />{" "}
            </Link>
        </div>
        <div className="col-2">
            <Link to="/kyc-doc-submitted">
            {" "}
            <OutletBox
                className="col-md-3"
                label="Doc Submitted"
                styles={{ "backgroundColor": "#AAFFAA", "marginTop": "40px", "width": "150px", "height": "100px"}}
                count={docSubmitted}
                backGroundColor=""
            />{" "}
            </Link>
        </div>
        <div className="col-2">
            <Link to="/fi-approved">
                <OutletBox
                className="col-md-3"
                label="Doc uploaded"
                count={accountForm}
                backGroundColor="bg-light-success"
                />
            </Link>
        </div>
        <div className="col-2">
            <Link to="/kyc-rejected">
            <OutletBox
            className="col-md-3"
            label="Rejected"
            count={totalRejected}
            backGroundColor="bg-light-danger"
            />
        </Link>        
        </div>
        <div className="col-2">
            <Link to="/confirmed-limits">
                <OutletBox
                className="col-md-3"
                label="Loan Approved"
                count={totalLoanApproved}
                backGroundColor="bg-light-success"
                />
            </Link>
        </div>
        </div>
      {isLoading ? (
        <div>
          <div style={{ textAlign: "center" }}>
            <Loader type="Rings" color="#00BFFF" height={100} width={100} />
          </div>
        </div>
      ) : (
          <DataTable
            noHeader
            striped
            columns={column}
            data={rows}
            highlightOnHover
            pagination
            paginationServer
            subHeader
            subHeaderComponent={subHeader}
            paginationTotalRows={totaRows}
            paginationPerPage={10}
            paginationComponentOptions={{
              noRowsPerPage: true,
            }}
            onChangePage={(page) => setPageCounter(page)}
          />
        )}
      {preveiw && (
        <ModalForm
          modalTitle="Preview"
          toggle={toggle}
          modal={modal}
          btnName="Close"
          noCancelBtn={true}
          handleClick={toggle}
          size="lg"
        >
          {isNid && (
            <><Card.Body className="form-control m-2" style={{"height":"12%", "overflow":"hidden", "width":"98%"}}>
                   <div className="row">
                        <div className="col-6 row">
                            <label className="col-4 font-weight-bolder form-label">Outlet name:</label>
                            <label className="col-6 form-label">{currentHouseRow.outlet_name}</label>
                        </div>
                        <div className="col-6 row">
                            <label className="col-4 font-weight-bolder form-label">Outlet Code:</label>
                            <label className="col-6 form-label">{currentHouseRow.outlet_code}</label>
                        </div>
                    </div>
                </Card.Body>
            <div className="row d-flex justify-content-center">
              <Card className="mb-5 shadow">
                <Card.Title className="text-center pt-2">User NID</Card.Title>
                <hr></hr>
                <Card.Body>
                  <img
                    src={"data:image/png;base64, "+nidImages.own_nid_front}
                    className="border-right pr-5 "
                    alt="Profile"
                    style={{ height: "200px" }}
                  />
                  <img
                    className="pl-5"
                    src={"data:image/png;base64, "+nidImages.own_nid_back}
                    alt="Profile"
                    style={{ height: "200px" }}
                  />
                </Card.Body>
              </Card>

              <Card className="mb-5 shadow">
                <Card.Title className="text-center pt-2">
                  Nominee NID
                </Card.Title>
                <hr></hr>
                <Card.Body>
                  <img
                    src={"data:image/png;base64, "+nidImages.nominee_nid_front}
                    className="border-right pr-5 "
                    alt="Profile"
                    style={{ height: "200px" }}
                  />
                  <img
                    className="pl-5"
                    src={"data:image/png;base64, "+nidImages.nominee_nid_back}
                    alt="Profile"
                    style={{ height: "200px" }}
                  />
                </Card.Body>
              </Card>
            </div></>
          )}

          {isAccForm && (
            <div className="d-flex justify-content-lg-center">
              <Card className=" shadow">
                <Card.Title className="text-center pt-2">
                  Account Form
                </Card.Title>
                <hr></hr>
                <Card.Body>
                  <img
                    src={accountFormUrl + accountFormImage.image1}
                    className="border-right pr-5 "
                    alt="Nominee NID front"
                    style={{ height: "250px" }}
                  />
                  <img
                    className="pl-5"
                    src={accountFormUrl + accountFormImage.image2}
                    alt="Nominee NID front"
                    style={{ height: "250px" }}
                  />
                </Card.Body>
              </Card>
            </div>
          )}
        </ModalForm>
      )}
      {onUpload && (
        <ModalForm
          modalTitle="Upload File"
          toggle={toggle}
          modal={modal}
          btnName="Submit"
          handleClick={handleSubmit}
          size="md"
        >
          <input type="file" accept=".zip" onChange={handleChange} />
        </ModalForm>
      )}
      {
        singleAccountFormUpload && (
          <ModalForm
          modalTitle = "Upload Account Form"
          toggle = {toggle}
          modal={modal}
          btnName="Submit"
          handleClick={handleSubmit}
          >
             <input type="file" accept=".zip" onChange={handleChange} />
          </ModalForm>
        )
      }

      {isViewUserDetails && (
        <ModalForm
          modalTitle="User Details"
          toggle={toggle}
          modal={modal}
          btnName="Close"
          noCancelBtn={true}
          handleClick={toggle}
          size="lg"
        >
          <div>
            <Card>
                <Card.Body>
                    <UserDetails userDetails={userDetails} />
                </Card.Body>
            </Card>
          </div>
        </ModalForm>
      )}
    </div>
  );
}

function OutletBox(props) {
  return (
    <div
      className={`${props.backGroundColor} px-6 py-8 rounded-xl`}
      style={props.styles ? props.styles : styles}
    >
      <h5>{props.label}</h5>
      <span className="svg-icon svg-icon-3x svg-icon-primary d-block my-2">
        {props.count}
      </span>
    </div>
  );
}
export default KycListDh;
