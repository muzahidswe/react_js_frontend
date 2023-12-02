import React, { Fragment, useEffect, useState } from "react";
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import { ModalFormApproveReject } from "./../common/modalForm";
import { getKycTitle, rejectKyc, uploadAccountForm } from "../../services/kyc-list-service";
import Loader from "react-loader-spinner";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import { useAlert } from "react-alert";
export function UploadAccountForm(props) {
    const toast = useAlert();
    const [loading, setLoading] = useState(true);
    const [fiTitles, setFiTitles] = useState([]);
    const [approveCheckBox, setApproveCheckBox] = useState({});
    const [fiMustUpload, setFiMustUpload] = useState([]);
    const [openRejectTextField, setOpenRejectTextField] = useState(false);
    const [approvalButtonAvailable, setApprovalButtonAvailable] = useState(true);
    const [fiUploadedForms, setFiUploadedForms] = useState({});
    const [uploadedFileName, setUploadedFileName] = useState({});
    const [prefix, setPrefix] = useState({});
    const [rejectionReason,setRejectionReason] = useState();
    const handleReject =async () => {
      if(openRejectTextField){
        var reject  = await rejectKyc(props.currentHouseRow["id_outlet"],rejectionReason);
        if(reject){
            toast.success("KYC Rejected Successfully")
        }else{
            toast.error("KYC rejection Failed")
        }
        setOpenRejectTextField(false);

        props.uploadDone();
        props.toggle();

      }else{
        setRejectionReason();
        setOpenRejectTextField(true);
        setApprovalButtonAvailable(false);
      }
    }

    const handleApprove = async () => {
        var canUpload = true;
        if (fiMustUpload.length > 0) {
            fiMustUpload.forEach(e => {
                if (e.id in fiUploadedForms) {

                } else {
                    canUpload = false;
                }
            })
        }
        if (!canUpload) {
           
            toast.error("Please Upload all the Documents");
        } else {
            var formdata = new FormData();
            var multipleFileHaveSameName = false;
            if (Object.keys(fiUploadedForms).length > 0) {
                var selectedFileNames = [];
                var i=0;
                formdata.append(`outlet_code`,props.currentHouseRow["outlet_code"]);
                formdata.append(`id_outlet`,props.currentHouseRow["id_outlet"]);
                var createdBy = localStorage.getItem("id");
                formdata.append(`created_by`,createdBy);
                Object.keys(fiUploadedForms).forEach(function (key) {
                    if (selectedFileNames.includes(fiUploadedForms[key].name)) {
                        multipleFileHaveSameName = true;
                    }
                    selectedFileNames.push(fiUploadedForms[key].name)
                    var file_name_array = fiUploadedForms[key].name.split(".");                    
                    var file_extension = file_name_array[file_name_array.length - 1];
                    var name = props.currentHouseRow["outlet_code"]+"_"+prefix[key]+"."+file_extension;
                    formdata.append(`files`,fiUploadedForms[key]);
                    formdata.append(`names[${i}]`,name);
                    formdata.append(`titles`,key);
                    ++i;
                });
            }
            var status = false;
            if (!multipleFileHaveSameName) {
                status = await uploadAccountForm(formdata);
                if(status && canUpload){
                    toast.success("KYC Form Uploaded Successfully");
                }else{
                    toast.error("KYC Form Upload Failed");
                }
                props.uploadDone();
                props.toggle();
            }else{
                toast.error("Please select different files for each file selection input.");
            }            
        }




        // if (Object.keys(fiUploadedForms).length > 0) {
        //     Object.keys(fiUploadedForms).forEach(function (key) {
        //         console.log(fiUploadedForms[key]);
        //     });
        // }
    }

    const handleCancel = () => {
        if (openRejectTextField) {
            setOpenRejectTextField(false);
            return;
        } else {
            props.toggle();
            props.handleApprovalFormCancel();
        }
    }

    const onRejectTextChange = (event) => {
       setRejectionReason(event.target.value);
    }

    const insertNewFIUploadedFile = id => event => {

        fiUploadedForms[id] = event.target.files[0];
        setFiUploadedForms(fiUploadedForms)
    }
    useEffect(() => {
        (async () => {
            const data = await getKycTitle();
            setFiTitles(data);
            let approveCheck = {};
            let tempPrefix = {};
            let fiUpload = []
            data.forEach(e => {
                if (e.is_fi_upload_required === 1) {
                    fiUpload.push(e);
                    tempPrefix[e.id] = e.file_prefix;
                }
                approveCheck[e.id] = props.currentHouseRow[e.id + "_checked"] === "Yes" ? true : false;
            })
            setPrefix(tempPrefix);
            setApproveCheckBox(approveCheck);
            setFiMustUpload(fiUpload);
            setLoading(false);
        })();
    }, []);
    return (

        <ModalFormApproveReject
            modalTitle="Review Outlet Kyc"
            toggle={props.toggle}
            modal={props.modal}
            rejectButton="Reject"
            approveButton="Approve"
            approveButtonAvailable={approvalButtonAvailable}
            rejectButtonAvailable={true}
            handleCancel={handleCancel}
            handleReject={handleReject}
            handleApprove={handleApprove}
            currentHouseRow={props.currentHouseRow}
            size="lg"
        >
            {
                openRejectTextField ? (<FormGroup> <TextField

                    onChange={onRejectTextChange}

                    id="filled-multiline-static"

                    multiline
                    rows="4"

                    helperText="Please give a reason for rejection"
                    margin="normal"
                    variant="filled"
                />
                </FormGroup>
                )
                    : (
                        <FormGroup >

                            {loading ? (
                                <div>
                                    <div style={{ textAlign: "center" }}>
                                        <Loader type="Rings" color="#00BFFF" height={100} width={100} />
                                    </div>
                                </div>
                            ) : (

                                    fiTitles.map((title, i) => {
                                        //   var id_checked = title.id + "_checked";
                                        return title.is_fi_upload_required === 1 ? (
                                            <div className="row">
                                                <div className="col-md-6">
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={approveCheckBox[title.id]}
                                                            color="primary"
                                                        />
                                                    }
                                                    label={title.title}
                                                />
                                                </div>
                                                <div className="col-md-6">
                                                    <input type="file" onChange={insertNewFIUploadedFile(title.id)} />
                                                </div>

                                            </div>
                                        ) : (
                                                <div className="row">
                                                    <div className="col-md-6">
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={approveCheckBox[title.id]}

                                                                value=""
                                                                color="primary"
                                                            />
                                                        }
                                                        label={title.title}
                                                    />
                                                    </div>
                                                </div>
                                            );
                                    })

                                )

                            }
                        </FormGroup >
                    )
            }




        </ModalFormApproveReject>
    );
}