import React, { useEffect, useState } from "react";
import { Card, Form, InputGroup } from "react-bootstrap";
import DropdownMenuGroup from "../helper/top_dropdown_with_outlet";
import Loader from "react-loader-spinner";
import { getFi, insertFi, fileUploadInterest } from "../../services/interestServices";
import Select from 'react-select';
import { useAlert } from 'react-alert';
import * as Yup from "yup";
import { useFormik } from "formik";
import { baseURL } from "../../constants/constants";
import axios from "axios";
import styled from "styled-components";
import DataTable from "react-data-table-component";
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import swal from 'sweetalert';
import styles from './insertInterest.module.css';

const initialValues = {
    interest_percentage: "",
    service_charge_percentage: "",
    penalty_percentage: "",
}

const DATA_TABLE_URL = baseURL + "get-uploaded-interest-settings";

const FilterComponent = ({ filterText, onFilter, searchClick }) => (
    <>
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
                placeholder="Search By FI, House, Outlet Code or Point Name"
                inputProps={{ 'aria-label': 'Search By FI, House or Point Name' }}
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

function InsertInterestSettings(props) {
    const sampleDownload = baseURL + 'download/samples/interest_settings_by_outlet_code_sample.xlsx';

    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [dpids, setDpids] = useState(localStorage.getItem("dpids").split(","));
    const [outletIds, setOutletIds] = useState([]);
    const [fi, setFi] = useState([]);
    const alert = useAlert();
    const [selectedFi, setSelectedFi] = useState({ label: "Select Fi", value: "" });
    const [selectedFiForFileUpload, setSelectedFiForFileUpload] = useState({ label: "Select Fi", value: "" }); 
    const insertInterestSchema = Yup.object().shape({
        interest_percentage: Yup.number().required("Please Enter The Interest Percentage"),
        service_charge_percentage: Yup.number().required("Please Enter The Service Charge Percentage"),
        penalty_percentage: Yup.number().required("Please Enter The Penalty Percentage"),
    })

    const handleDpidChange = (ids) => {
        setDpids(ids);
    };

    const handleOutletIdChange = (ids) => {
        setOutletIds(ids);
    };

    const columns = [
        {
            name: "FI",
            selector: "fi_name",
            grow:3,
            sortable: true,
        },
        {
            name: "House",
            selector: "dist_house",
            grow:7,
            sortable: true,
        },
        {
            name: "Point",
            selector: "point",
            grow:4,
            sortable: true,
        },
        {
            name: "Outlet Code",
            selector: "outlet_code",
            grow: 4,
            sortable: true,
        },
        {
            name: "Interest Percentage",
            selector: "interest_percentage",
            sortable: true,
        },
        {
            name: "Service Charge Percentage",
            selector: "service_charge_percentage",
            sortable: true,
        },
        {
            name: "Penalty Percentage",
            selector: "penalty_percentage",
            sortable: true,
        }
    ];

    const [filterText, setFilterText] = React.useState("");
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const dataToShow = data ? data.length>0? data :[] : null;
    const [totalRows, setTotalRows] = useState(0);
    const countPerPage = 10;
    const searchClick = () => {
        getDatas();
    }

    const subHeaderComponentMemo = React.useMemo(() => {
        return (
            <FilterComponent
                searchClick={searchClick}
                onFilter={(e) => setFilterText(e.target.value)}
                filterText={filterText}
            />
        );
    }, [filterText]);
    
    const formik = useFormik({
        initialValues,
        validationSchema: insertInterestSchema,
        onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
            if (dpids.length > 0) {
                if (selectedFi.value === "") {
                    alert.info("Please Select FI");
                } else {

                    setSubmitting(true);
                    setLoading(true);
                    const insert = await insertFi(selectedFi.value, outletIds, values.interest_percentage, values.service_charge_percentage, values.penalty_percentage);
                    if (insert === 1) {
                        alert.success("Interest Settings Submitted Successfully");
                    } else {
                        alert.error("Could Not Submit Interest Settings");
                    }
                    setLoading(false);
                    setSubmitting(false);
                    resetForm({});
                    getDatas();
                }
            } else {
                alert.info("Please select the points you want to save the interests");
            }

        }
    })

    const initialValues2 = {
        file: "",
        fi_select: null
    };

    const uploadFile = Yup.object().shape({
        file: Yup.mixed().required(),
        fi_select: Yup.object().shape({
            label: Yup.string().required('required'),
            value: Yup.number().required('required'),
        }).nullable().required('Select a FI')

    });

    const formik2 = useFormik({
        initialValues: initialValues2,
        validationSchema: uploadFile,
        onSubmit: (values, { setStatus, setSubmitting }) => {   
            swal({
                icon: "load.gif",
                buttons: false,
            });         
            setSubmitting(true);
            setLoading(true);
            fileUploadInterest(document.getElementById('uploadFile').files[0], selectedFiForFileUpload.value).then((val)=>{
                if (val.data.success) {
                    alert.success(val.data.message);
                }else{
                    alert.error(val.data.message);
                }
                swal.close();
            });
        }
    });


    const getDatas = () => {
        var token = localStorage.getItem("token");
    
        axios
          .post(
            DATA_TABLE_URL,
            { outlet_code: outletIds, dpids, per_page: countPerPage, current_page: page, filterText: filterText },
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
            }
          )
          .then((res) => {
            setData(res?.data?.data?.data);
    
            //setDataToShow(res.data.data.data);
            setTotalRows(res.data.data.pagination.total);
          })
          .catch((err) => {
            setData([]);
            setTotalRows(0);
          });
    
        setIsLoading(false);
      };

    useEffect(() => {
        (async () => {
            const fis = await getFi();

            if (fis != null) {
                const tempFi = [];
                if (fis.length > 0) {
                    fis.forEach(e => {
                        tempFi.push({ label: e.name, value: e.id })
                    });
                }
                setFi(tempFi);
            } else {
                alert.error("Some Error Occurred");
            }

            setIsLoading(false);
        })()
    }, []); 
    
    useEffect(() => {
        getDatas();
    
    }, [page, dpids, outletIds])
    
    const getInputClasses = (fieldname) => {
        if (formik.touched[fieldname] && formik.errors[fieldname]) {
            return "is-invalid";
        }

        if (formik.touched[fieldname] && !formik.errors[fieldname]) {
            return "is-valid";
        }

        return "";
    };

    return (
        isLoading ? (<div>
            <div style={{ textAlign: "center" }}>
                <Loader type="Rings" color="#00BFFF" height={100} width={100} />
            </div>
        </div>) : (
            <div className="container dash-tabs pt-9 pb-9">
                <Card style={{zIndex: 2, marginBottom: '2rem'}}>
                    <Card.Body>
                        <form onSubmit={formik2.handleSubmit} autoComplete="off" className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp">
                            <div className="row">
                                <div className="col-3">
                                    <h4 className="card-title">Upload Interest Settings</h4>
                                </div>
                                <div className="col-6">
                                    <div className={styles.fiInputWrapper}>
                                        <div>
                                            <label ><strong>Select FI</strong></label>
                                            <Select
                                                name="fi_select"
                                                value={formik2.values.fi_select}
                                                options={fi}
                                                {...formik2.getFieldProps("fi_select")}
                                                onChange={(option, action) => {
                                                    setSelectedFiForFileUpload(option)
                                                    formik2.setFieldValue('fi_select', option);
                                                }}
                                            />

                                            {formik2.touched.fi_select && formik2.errors.fi_select ? (
                                                <div className="fv-plugins-message-container">
                                                    <div className="fv-help-block">{formik2.errors.fi_select}</div>
                                                </div>
                                                ) : null
                                            }
                                        </div>

                                        <div>
                                            <div className="input-group">
                                                <input
                                                    type="file"
                                                    className={`form-control ${getInputClasses("file")}`}
                                                    name="file"
                                                    id="uploadFile"
                                                    {...formik2.getFieldProps("file")}
                                                />
                                            </div>
                                            {formik2.touched.file && formik2.errors.file ? (
                                                <div className="fv-plugins-message-container">
                                                    <div className="fv-help-block">{formik2.errors.file}</div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-3">
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
                        </form>
                    </Card.Body>
                </Card>

                <Card class="m-5" style={{marginBottom: '2rem'}}>
                    <Card.Body >
                        <Card.Header className="p-0">
                            <h3 className="card-title">Interest & Service Charge Settings</h3>
                        </Card.Header>
                        
                        <DropdownMenuGroup onDpidChange={handleDpidChange} onOutletIdChange={handleOutletIdChange} isSearch={false} />
                        
                        <div className="row">
                            <div className="col-md-12">
                                <Card>
                                <Form class="m-10" onSubmit={formik.handleSubmit} autoComplete="off">
                                    <div className="row m-2">
                                        <div className="col-md-3">
                                            <label ><strong>Select FI</strong></label>
                                            <Select
                                                value={selectedFi}
                                                onChange={setSelectedFi}
                                                options={fi}
                                            />

                                        </div>
                                        <div className="col-md-3">
                                            <label for="interest_percentage"><strong>Interest Percentage</strong></label>
                                            <InputGroup >
                                                <input
                                                    placeholder="Interest Percentage"
                                                    type="number"
                                                    className={`form-control  h-auto  px-6 ${getInputClasses(
                                                        "interest_percentage"
                                                    )}`}
                                                    name="interest_percentage"
                                                    {...formik.getFieldProps("interest_percentage")}
                                                />
                                                <InputGroup.Append>
                                                    <InputGroup.Text>%</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                            {formik.touched.interest_percentage && formik.errors.interest_percentage ? (
                                                <div className="fv-plugins-message-container">
                                                    <div className="fv-help-block">{formik.errors.interest_percentage}</div>
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="col-md-3">
                                            <label for="service_charge_percentage"><strong>Service Charge Percentage</strong></label>
                                            <InputGroup >
                                                <input
                                                    placeholder="Service Charge Percentage"
                                                    type="number"
                                                    className={`form-control  h-auto  px-6 ${getInputClasses(
                                                        "service_charge_percentage"
                                                    )}`}
                                                    name="service_charge_percentage"
                                                    {...formik.getFieldProps("service_charge_percentage")}
                                                />
                                                <InputGroup.Append>
                                                    <InputGroup.Text>%</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                            {formik.touched.service_charge_percentage && formik.errors.service_charge_percentage ? (
                                                <div className="fv-plugins-message-container">
                                                    <div className="fv-help-block">{formik.errors.service_charge_percentage}</div>
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="col-md-3">
                                            <label for="penalty_percentage"><strong>Penalty Percentage</strong></label>
                                            <InputGroup >
                                                <input
                                                    placeholder="Penalty Percentage"
                                                    type="number"
                                                    className={`form-control  h-auto  px-6 ${getInputClasses(
                                                        "penalty_percentage"
                                                    )}`}
                                                    name="penalty_percentage"
                                                    {...formik.getFieldProps("penalty_percentage")}
                                                />
                                                <InputGroup.Append>
                                                    <InputGroup.Text>%</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                            {formik.touched.penalty_percentage && formik.errors.penalty_percentage ? (
                                                <div className="fv-plugins-message-container">
                                                    <div className="fv-help-block">{formik.errors.penalty_percentage}</div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <br></br>
                                    <div className="row mr-2">
                                        <div className="col-md-12">
                                            <div className="form-group pull-right float-right d-flex flex-wrap flex-center">
                                                <button
                                                    type="submit"
                                                    //onClick={addPaymentMethod}
                                                    className="btn btn-primary font-weight-bold"
                                                >
                                                    <span>SAVE</span>
                                                    {loading && <span className="ml-3 spinner spinner-white"></span>}
                                                </button>


                                            </div>
                                        </div>
                                    </div>
                                </Form>
                                </Card>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card class="m-5">
                    <Card.Body >
                        <Card.Header className="p-0">
                            <h3 className="card-title">Interest & Service Charge List</h3>
                        </Card.Header>

                        <DataTable
                            noHeader
                            columns={columns}
                            data={dataToShow}
                            highlightOnHover
                            pagination
                            paginationServer
                            subHeader
                            subHeaderComponent={subHeaderComponentMemo}
                            paginationTotalRows={totalRows}
                            paginationPerPage={countPerPage}
                            paginationComponentOptions={{
                                noRowsPerPage: true,
                            }}
                            onChangePage={(page) => setPage(page)}
                        />
                    </Card.Body>
                </Card>
            </div>
        )
    );
}

export default InsertInterestSettings;