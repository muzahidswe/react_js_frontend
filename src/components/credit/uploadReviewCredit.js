import React, { Fragment, useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { Card, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import DropdownMenuGroup from "../helper/top_dropdown";
import styled from "styled-components";
import { useFormik } from "formik";
import { fileSubmitReviewOldCreditLimit } from '../../services/fileUploadServices';
import * as Yup from "yup";
import { useAlert } from 'react-alert';
import swal from 'sweetalert';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const DATA_TABLE_URL = baseURL+'scope-outlets';
const DATA_TABLE_DOWNLOAD_URL = baseURL+'scope-outlets-download';
const DELETE_URL = baseURL+'delete-scope-outlet';

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

const FilterComponent = ({ filterText, onFilter, searchClick, downloadUploadedDatas }) => (
  <>  
    <button
      id="dl_excel"
      title="Download as Excel"
      className="btn btn-success mr-5"
      onClick={() =>downloadUploadedDatas()}
    ><i className="la la-file-excel icon-xl"></i>
    </button>

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


function UploadReviewCredit(props) {
    const alert = useAlert();
    
    const deleteScopeOutlet = (id) => {
        confirmAlert({
            title: 'Are you sure?',
            message: 'You wont be able to revert this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => confirmDeleteOutlet(id),
                    className: "btn btn-danger"
                },
                {
                    label: 'No',
                    onClick: () => console.log('Click No'),
                    className: "btn btn-success"
                }
            ]
        });        
    }

    const confirmDeleteOutlet = (id) => {
        axios.post(`${DELETE_URL}`,{
            id: id
        }).then(res => {
            alert.success('Successfully deleted.');
            getUploadedDatas();
        }).catch(err => {
            alert.error('Something went wrong.');
            // setData({});
            // setTotalRows(0);
            // setHeaders([]);
        });
    }

    const columns = [
    {
        name: 'Point',
        selector: 'dp_name',
        sortable: true
    },
    {
        name: 'Outlet Code',
        selector: 'outlet_code',
    },
    {
        name: 'Outlet Name',
        selector: 'outlet_name',
        sortable: true
    },
    {
        name: 'Owner Name',
        selector: 'owner_name',
        sortable: true
    },
    {
        name: 'Phone No.',
        selector: 'phone',
        sortable: true
    },
    {
        name: 'Address',
        selector: 'address',
        sortable: true
    },
    {
        name: 'Action(s)',
        cell: row =><button onClick={()=>{deleteScopeOutlet(row.id)}} className="btn btn-danger btn-sm"><i className="fa fa-trash"></i></button>
    }
    ]

    const [headers, setHeaders] = useState([]);
    const [filterText, setFilterText] = React.useState("");
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const countPerPage = 10;

    const [totalRows, setTotalRows] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [dpids, setDpids] = useState(localStorage.getItem("dpids").split(","));
    const [loading, setLoading] = useState(false);
    
    const getUploadedDatas = () => {
        axios.post(`${DATA_TABLE_URL}?page=${page}&per_page=${countPerPage}`, 
            {dpids, filterText}
        )
        .then(res => {
            setData(res.data.data);
            setTotalRows(res.data.data.pagination.total);
            setHeaders(columns);
        }).catch(err => {
            setData({});
            setTotalRows(0);
            setHeaders([]);
        });
        setIsLoading(false);
    };

    const downloadUploadedDatas = async () => {
        setIsLoading(true);
        await axios.post(`${DATA_TABLE_DOWNLOAD_URL}`, 
            {dpids, filterText}
        )
        .then(res => {
            window.open(res?.data?.data, '_blank', 'noopener,noreferrer')
            setIsLoading(false);
        }).catch(err => {
            alert.error(err.message);
            setIsLoading(false);
        });
        
    }

    const initialValues = {
        file: ""
    };

    const uploadFile = Yup.object().shape({
        file: Yup.mixed().required()
    });    

    const formik = useFormik({
        initialValues,
        validationSchema: uploadFile,
        onSubmit: (values, { setStatus, setSubmitting }) => {   
            swal({
                icon: "load.gif",
                buttons: false,
            });         
            setSubmitting(true);
            setLoading(true);
            fileSubmitReviewOldCreditLimit(document.getElementById('uploadFile').files[0]).then((val)=>{
                if (val.data.success) {
                    alert.success(val.data.message);
                }else{
                    alert.error(val.data.message);
                }
                swal.close();
            });
        }
    });

    const handleDpidChange = (ids) => {
        setDpids(ids);
    };

    const getInputClasses = (fieldname) => {
        if (formik.touched[fieldname] && formik.errors[fieldname]) {
            return "is-invalid";
        }

        if (formik.touched[fieldname] && !formik.errors[fieldname]) {
            return "is-valid";
        }

        return "";
    };

    useEffect(() => {
        getUploadedDatas();
    }, [page, dpids]);

    const searchClick = () => {
        getUploadedDatas();
    }

    const subHeader = React.useMemo(() => {
    return (
        <Fragment>
            <FilterComponent
                searchClick={searchClick}
                onFilter={(e) => {
                setFilterText(e.target.value)

                }}
                downloadUploadedDatas = {downloadUploadedDatas}
                filterText={filterText}
            />
        </Fragment>
        );
    }, [filterText]);
    const sampleDownload = baseURL + 'download/samples/review_credit_sample.xlsx';
    const [userType, setUserType] = useState(localStorage.getItem("cr_user_type"));
    return isLoading ? 
    <div>
        <div style={{ textAlign: "center" }}>
            <Loader type="Rings" color="#00BFFF" height={100} width={100} />
        </div>
    </div> : (
        <>  
            {userType == 'superadmin' ? (
                <Card className="m-5">
                    <Card.Body>                    
                        <form onSubmit={formik.handleSubmit} autoComplete="off" className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp">
                            <div className="row">
                                <div className="col-3">
                                    <h4 className="card-title">Review Old Credit Limit</h4>
                                </div>

                                <div className="col-6">
                                    <div style={{color: 'red', marginBottom: 5}}>Make sure that you are uploading only existing outlet info</div>

                                    <div className="row">
                                        <div className="col-8">
                                            <div className="input-group">
                                                <input
                                                    type="file"
                                                    className={`form-control ${getInputClasses("file")}`}
                                                    name="file"
                                                    id="uploadFile"
                                                    {...formik.getFieldProps("file")}
                                                />
                                            </div>
                                            {formik.touched.file && formik.errors.file ? (
                                                <div className="fv-plugins-message-container">
                                                    <div className="fv-help-block">{formik.errors.file}</div>
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="col-4">
                                            <button
                                                type="submit"
                                                //onClick={addPaymentMethod}
                                                className="btn btn-success btn-sm"
                                            >
                                                <span>Upload</span>
                                                {/* {loading && <span className="ml-3 spinner spinner-white"></span>} */}
                                            </button>
                                            <a href={sampleDownload} className="pl-5">
                                                <button
                                                            type="button"
                                                            //onClick={addPaymentMethod}
                                                            className="btn btn-primary btn-sm"
                                                        >
                                                            <span>Download Sample</span>
                                                            {/* {loading && <span className="ml-3 spinner spinner-white"></span>} */}
                                                        </button>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            ) : <></>}
        </>
    );
}

export default UploadReviewCredit;