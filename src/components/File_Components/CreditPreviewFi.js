import React, { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { Card, Modal, Button } from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/ModalHeader'
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import DropdownMenuGroup from "../helper/top_dropdown";
import styled from "styled-components";
import CreditUpload from "./CreditUpload"
import CrDetailsModal from "./CrDetailsModal"
import ComparisonModal from "./ComparisonModal"
import { useAlert } from 'react-alert';
import swal from 'sweetalert';
import { useSelector } from "react-redux";

const DATA_TABLE_URL = baseURL+'get-uploads';
const DOWNLOAD_URL = baseURL+'download/';
const APPROVE_URL = baseURL+'approve-credit-limit/'+localStorage.getItem('cr_user_type');
const DOWNLOAD_MODIFICATION_FILE_URL = baseURL+'download-modification-file';

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;

  &:hover {
    cursor: pointer;
  }
`;

const FilterComponent = ({ filterText, onFilter }) => (
  <>
    <TextField
      id="search"
      type="text"
      placeholder="Search"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    />
  </>
);


function CreditPreviewFi(props) {
    const {selected_fi} = useSelector(state => state.fi);
    const alert = useAlert();
    const [cr_user_type, setCrUserType] = useState(localStorage.getItem('cr_user_type'));
    const [show, setShow] = useState(false);
    const approveLimit = (cr_retail_limit_info_id) => {
        swal({
            icon: "load.gif",
            buttons: false,
        }); 
        axios.put(`${APPROVE_URL}/${cr_retail_limit_info_id}`,{
            userId: localStorage.getItem('id')
        }).then(res => {
            alert.success("Approved Successfully.");
            getUploadedDatas();
            swal.close();
        }).catch(err => {
            alert.success(err.message);
            swal.close();
            // setData({});
            // setTotalRows(0);
            // setHeaders([]);
        });
    }
    const handleClose = () => {
        setShow(false);
        getUploadedDatas();
    };
    const [effective_date, setEffectiveDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [title, setTitle] = useState('');
    const handleShow = (id, effective_date, end_date, title) => {
        setCrRetailLimitInfoId(id);
        setEffectiveDate(effective_date);
        setTitle(title);
        setEndDate(end_date);
        setShow(true);
    };

    const [showDetails, setShowDetails] = useState(false);
    const handleDetailsClose = () => setShowDetails(false);
    const handleDetailsShow = () => setShowDetails(true);
    const [cr_retail_limit_info_id, setCrRetailLimitInfoId] = useState("");
    const [row_status, setRowStatus] = useState("");

    const showDetailsModal = (cr_retail_limit_info_id) => {
        setCrRetailLimitInfoId(cr_retail_limit_info_id);
        setShowDetails(true)
    }

    const [showComparison, setShowComparison] = useState(false);
    const handleComparisonClose = () => setShowComparison(false);
    const handleComparisonShow = () => setShowComparison(true);
    const showComparisonModal = (cr_retail_limit_info_id, rowStatus) => {
        setCrRetailLimitInfoId(cr_retail_limit_info_id);
        setShowComparison(true);
        setRowStatus(rowStatus);
    }

    const downloadForModification = (id, status) => {
        swal({
            icon: "load.gif",
            buttons: false,
        });
        axios.post(`${DOWNLOAD_MODIFICATION_FILE_URL}`,{
            id,status
        }).then(res => {
            alert.info('Please do not change anything but "H" column');
            window.open(res?.data?.data, "_blank")
            swal.close();
        }).catch(err => {
            alert.error(err.message);
            swal.close();
        });
    }

    const gridBtn = (statusName, id, effective_date, end_date, title) => {
        var btn;
        setCrUserType(localStorage.getItem('cr_user_type'))
        switch (statusName) {
            case 'FI Initiated':
                btn = <span>No Action</span>
                if (cr_user_type == 'bat') {
                    btn = <span><a data-id={id} style={{cursor: "pointer", color:"blue"}} onClick={() => { approveLimit(id) }}>Check</a> / <a style={{cursor: "pointer", color:"blue"}} onClick={() =>{handleShow(id, effective_date, end_date, title)}}>Modify</a> </span>
                }         
                break;

            case 'BAT Modified':
            case 'BAT Approved':
                btn =  <span>No Action</span>
                if (cr_user_type == 'fi') {
                    btn = <span><a data-id={id} style={{cursor: "pointer", color:"blue"}} onClick={() => { approveLimit(id) }}>Check</a> / <a style={{cursor: "pointer", color:"blue"}} onClick={() =>{handleShow(id, effective_date, end_date, title)}}>Modify</a> </span>
                }  
                break;

            case 'FI Modified':
                btn =  <span>No Action</span>
                if (cr_user_type == 'bat') {
                    btn = <span><a data-id={id} style={{cursor: "pointer", color:"blue"}} onClick={() => { approveLimit(id) }}>Check</a> / <a style={{cursor: "pointer", color:"blue"}} onClick={() =>{handleShow(id, effective_date, end_date, title)}}>Modify</a> </span>
                }  
                break;

            case 'Limit confirmed':
                //setBtn()
                break;
        
            default:
                break;
        }
        return btn;
    }
    const columns = [
    {
        name: 'Title',
        selector: 'title',
        sortable: true
    },
    {
        name: 'Note',
        selector: 'note',
    },
    {
        name: 'Uploaded By',
        selector: 'uploaded_by',
        sortable: true
    },
    {
        name: 'Date',
        selector: 'uploaded_at',
        sortable: true
    },
    {
        name: 'Status',
        selector: 'status',
        sortable: true
    },
    {
        name: 'Action(s)',
        cell: row => gridBtn(row.status, row.id, row.effective_date, row.end_date, row.title)
    },
    {
        name: 'Download',
        cell: row => <a title="Download" style={{cursor: "pointer"}} onClick={() => { downloadForModification(row.id, row.status) }}><i className="fas fa-download text-success"></i></a>
    },
    {
        name: 'Details',
        cell: row => (<>
            <a title="Details" style={{cursor: "pointer", color:"blue"}} onClick={() => { showDetailsModal(row.id) }}><i className="fas fa-bars text-primary"></i></a>
            {row.status != 'FI Initiated' ? (<a title="Comparison" style={{cursor: "pointer", color:"blue"}} onClick={() => { showComparisonModal(row.id, row.status) }}>{'\u00A0\u00A0\u00A0'}<i className="fas fa-retweet text-info"></i></a>) : <></>}
        </>)
    }
    ]

    const [headers, setHeaders] = useState([]);
    const [filterText, setFilterText] = React.useState("");
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const countPerPage = 10;

    const [totalRows, setTotalRows] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [dpids, setDpids] = useState();

    const subHeaderComponentMemo = React.useMemo(() => {
        return (
        <FilterComponent
            onFilter={(e) => setFilterText(e.target.value)}
            filterText={filterText}
        />
        );
    }, [dpids, filterText]);
    
    const getUploadedDatas = () => {
        const params = {
            dpids,
            fi_id: selected_fi,
            cr_user_type: localStorage.getItem("cr_user_type")
        }
        axios.post(`${DATA_TABLE_URL}?page=${page}&per_page=${countPerPage}`, params).then(res => {
            setData(res.data.data);
            setTotalRows(res.data.data.pagination.total);
            setHeaders(columns);
        }).catch(err => {
            setData({});
            setTotalRows(0);
            setHeaders([]);
        });
        setIsLoading(false);
    }

    const handleDpidChange = (ids) => {
        setDpids(ids);
    };

    useEffect(() => {
        getUploadedDatas();
    }, [page, dpids, selected_fi]);
    const [showDropdown, setShowDropdown] = useState(true);
    return isLoading ? 
    <div>
      <div style={{ textAlign: "center" }}>
        <Loader type="Rings" color="#00BFFF" height={100} width={100} />
      </div>
    </div> : (
        <>
            <Card className="m-5">
                <Card.Header>
                    <h3 className="card-title">Credit Limit Confirmation</h3>
                </Card.Header>
                    <Card.Body>
                        {showDropdown && (<DropdownMenuGroup onDpidChange={handleDpidChange} isSearch={true} />)}                        
                        <DataTable
                            noHeader
                            columns={headers}
                            data={data.data}
                            highlightOnHover
                            pagination
                            paginationServer
                            paginationTotalRows={totalRows}
                            paginationPerPage={countPerPage}
                            paginationComponentOptions={{
                                noRowsPerPage: true
                            }}
                            onChangePage={page => setPage(page)}
                        />
                    </Card.Body>
            </Card>
            <Modal show={show} 
                   onHide={handleClose} 
                   backdrop="static" 
                   keyboard={false} 
                   size="xl"
                   centered>
                <Modal.Header>
                    <Modal.Title> </Modal.Title>
                    <Button className="close" variant="secondary" onClick={handleClose}>
                        <i className="fa fa-times"></i>
                    </Button>
                </Modal.Header>
                <Modal.Body className="customModalBody">
                    <CreditUpload status="FI Modified" 
                                  headerLabel="Modify Credit Limit"
                                  handleClose = {handleClose}
                                  effectiveDate = {effective_date}
                                  endDate = {end_date}
                                  prevTitle = {title}
                                  noDownloadBtn
                                  cr_retail_limit_info_id = {cr_retail_limit_info_id}
                    ></CreditUpload>
                </Modal.Body>
            </Modal>
            <Modal show={showDetails} 
                   onHide={handleDetailsClose} 
                   backdrop="static" 
                   keyboard={false} 
                   size="lg"
                   centered>
                <Modal.Header>
                    <Modal.Title>Details</Modal.Title>
                    <Button className="close" variant="secondary" onClick={handleDetailsClose}>
                        <i className="fa fa-times"></i>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <CrDetailsModal cr_retail_limit_info_id={cr_retail_limit_info_id}></CrDetailsModal>
                </Modal.Body>
            </Modal>
            <Modal show={showComparison} 
                   onHide={handleComparisonClose} 
                   backdrop="static" 
                   keyboard={false} 
                   size="xl"
                   centered>
                <Modal.Header>
                    <Modal.Title>Comparison</Modal.Title>
                    <Button className="close" variant="secondary" onClick={handleComparisonClose}>
                        <i className="fa fa-times"></i>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <ComparisonModal 
                        cr_retail_limit_info_id={cr_retail_limit_info_id}
                        row_status={row_status}
                    ></ComparisonModal>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default CreditPreviewFi;