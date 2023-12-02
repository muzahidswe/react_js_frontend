import React, { Fragment, useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { Card, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import DropdownMenuGroup from "../helper/top_dropdown";
import styled from "styled-components";
import { useFormik } from "formik";
import { fileSubmitScopeoutlet } from '../../services/fileUploadServices';
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

const DATA_TABLE_URL = baseURL+'ekyc-nid-list';
const DATA_TABLE_DOWNLOAD_URL = baseURL+'download-ekyc-list';
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


function ScopeOutletPreview(props) {
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
        // axios.post(`${DELETE_URL}`,{
        //     id: id
        // }).then(res => {
        //     alert.success('Successfully deleted.');
        //     getUploadedDatas();
        // }).catch(err => {
        //     alert.error('Something went wrong.');
        //     // setData({});
        //     // setTotalRows(0);
        //     // setHeaders([]);
        // });
    }

    const columns = [
		{
			name: 'eKYC Date',
			selector: 'kyc_date',
			sortable: true
		},
		{
			name: 'House',
			selector: 'dh_name',
			sortable: true
		},
		{
			name: 'Point',
			selector: 'dp_name',
			sortable: true
		},
		{
			name: 'Outlet Code',
			selector: 'retailer_code',
			sortable: true
		},
		{
			name: 'Outlet Name',
			selector: 'outlet_name',
			sortable: true
		},
		{
			name: 'NID Name',
			selector: 'name_eng',
			sortable: true
		},
		{
			name: 'Phone',
			selector: 'kyc_phone',
			sortable: true
		},
		{
			name: 'Date of Birth',
			selector: 'dob',
			sortable: true
		}
    ]

    const [headers, setHeaders] = useState([]);
    const [filterText, setFilterText] = React.useState("");
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const countPerPage = 10;

    const [totalRows, setTotalRows] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [dpids, setDpids] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const getUploadedDatas = async () => {
        if (dpids.length > 0) {
            setIsLoading(true);
            await axios.post(`${DATA_TABLE_URL}`, 
                {dpids}
            )
            .then(res => {
                setIsLoading(false);
                setData(res.data.data);
                setTotalRows(res.data.data.length);
                setHeaders(columns);
            }).catch(err => {
                setData({});
                setTotalRows(0);
                setHeaders([]);
            });
        }
    };

    const downloadUploadedDatas = async () => {
        setIsLoading(true);
        await axios.post(`${DATA_TABLE_DOWNLOAD_URL}`, 
            {dpids}
        )
        .then(res => {
            window.open(res?.data?.data, '_blank', 'noopener, noreferrer')
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
            fileSubmitScopeoutlet(document.getElementById('uploadFile').files[0]).then((val)=>{
                getUploadedDatas();
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
        }, [dpids, filterText]
    );

    const sampleDownload = baseURL + 'download/samples/scope_outlets.xlsx';
    const [userType, setUserType] = useState(localStorage.getItem("cr_user_type"));
    
    return (
        <Card className="m-5">
            <Card.Header>
                <div className="row">
                    <h3 className="card-title">eKYC Outlet List</h3>
                </div>
                
            </Card.Header>
                <Card.Body>
                    <DropdownMenuGroup onDpidChange={handleDpidChange} isSearch={true} />

                    {isLoading ?
                        <div style={{ textAlign: "center" }}>
                            <Loader type="Rings" color="#00BFFF" height={100} width={100} />
                        </div>
                        :
                        <DataTable
                            noHeader
                            columns={headers}
                            data={data}
                            highlightOnHover
                            pagination
                            paginationServer
                            subHeader
                            subHeaderComponent={subHeader}
                            paginationTotalRows={totalRows}
                            paginationPerPage={countPerPage}
                            paginationComponentOptions={{
                                noRowsPerPage: true
                            }}
                            onChangePage={page => setPage(page)}
                        />
                    }
                </Card.Body>
        </Card>
    );
}

export default ScopeOutletPreview;