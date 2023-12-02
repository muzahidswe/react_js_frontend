import React, {useEffect, useState, Fragment} from "react";
import Loader from "react-loader-spinner";
import Datatable from "../common/datatable";
import {useAlert} from "react-alert";
import {
    uploadSalesFile
} from "../../services/reportService";
import axios from 'axios';


import {getCurrentUser, getDhId} from "../../services/authService";
import DropdownMenuGroup from "../common/TopDropdownWithYear";
import FileSaver from "file-saver";
import {baseURL} from "../../constants/constants";
import swal from 'sweetalert';

const REPORT_DOWNLOAD_URL = baseURL + 'download-sales-report';

const init = {
    filename: "",
};

function SalesReport(props) {
    const [dpids, setDpids] = useState(localStorage.getItem("dpids").split(","));
    const [year, setYear] = useState('');
    const toast = useAlert();
    const sampleFileLink = baseURL + 'node_api/credit/public/Yearly%20sales%20report.xlsx';
    const [currentUser, setCurrentUser] = useState("");

    /* start */
    const [formValue, setFormValue] = useState(init);

    const formValueChange = (name, value) => {
        setFormValue(prevState => ({...prevState, [name]: value}));
    }
    const sampleDownload = baseURL + 'download/samples/yearly_sales_report_sample.xlsx'
    const handleDownloadSampleFile = () =>{
        try {
            window.open(sampleDownload, "_blank")
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleUploadSalesFile = async () => {
        if(formValue.filename !== ''){
            swal({
                icon: "load.gif",
                buttons: false,
            });
            const formData = new FormData();
            formData.append("file", formValue.filename);
            try {
                await uploadSalesFile(formData);
                toast.success("File Uploaded successfully");
                setFormValue(init);
                swal.close();
            } catch (error) {
                toast.error("Something wrong while trying to upload file");
                setFormValue(init);
                swal.close();
            }
        }else{
            toast.error("File not found.");
        }
    };   
    
    const handleYearChange = (year) => {
        setYear(year);
    }

    const handleDpidChange = (ids) => {
        setDpids(ids);
        //downloadReport();
    };
    
    const downloadReport = async (dpids) => {
        if (1==2 && year == '') {
            toast.error('Please Select A Year Before Downloading')
        }else{
            swal({
                icon: "load.gif",
                buttons: false,
            });
            var token = localStorage.getItem("token");
            await axios.post(`${REPORT_DOWNLOAD_URL}`,{dpids, year},
            {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            }).then(res => {
                swal.close();
                window.open(res?.data?.data, "_blank");
            }).catch(err => {
            });
        }        
    }

    useEffect(() => {
        const user = getCurrentUser();
        if (user?.data) setCurrentUser(user.data.id);
    }, []);
    return (
        <div
            className="content d-flex flex-column flex-column-fluid"
            id="kt_content"
        >
            {/*  <ToastContainer /> */}
            {/*begin::Entry*/}
            <div className="d-flex flex-column-fluid">
                <div className="container">
                    {/*begin::Dashboard*/}
                    {/*begin::Row*/}
                    <div className="row">
                        <div className="col-lg-12 col-xxl-12">
                            {/*begin::List Widget 9*/}
                            <div className="card card-custom card-stretch gutter-b">
                                <div className="card-header border-0 ">
                                    <h3 className="card-title font-weight-bolder">
                                        Sales Report
                                    </h3>
                                </div>
                                <DropdownMenuGroup onYearChange={handleYearChange} onDpidChange={handleDpidChange} download={downloadReport} visible={false}/>

                                <div className="card-body" style={{"display":"none"}}>
                                    <form>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label><b>File Attachment</b></label>
                                                    <input type="file" className="form-control"
                                                           onChange={(e) => formValueChange('filename', e.target.files[0])}/>

                                                    
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>&nbsp;</label><br/>
                                                    <a className="btn btn-success" onClick={handleUploadSalesFile}>Upload File</a>
                                                    <button type="button" onClick={handleDownloadSampleFile} className="btn btn-info ml-2">Download Sample File </button>
                                                </div>

                                            </div>

                                        </div>

                                    </form>
                                </div>
                            </div>

                            {/*end: List Widget 9*/}
                        </div>
                    </div>
                </div>
                {/*end::Container*/}
            </div>
            {/*end::Entry*/}
        </div>
    );
}

export default SalesReport;
