import React, { Fragment, useEffect, useState } from "react";
import { fiBulkUpload, getKycTitle, } from "../../services/kyc-list-service";
import ModalForm from "./../common/modalForm";
import Loader from "react-loader-spinner";
import { Card } from 'react-bootstrap';
import { useAlert } from "react-alert";
import swal from 'sweetalert';
export function KycBulkUpload(props) {
    const [fiMustUpload, setFiMustUpload] = useState({});
    const [file, setFile] = useState();
    const [loading, setLoading] = useState(true);
    const toast = useAlert();
    useEffect(() => {
        (async () => {
            const data = await getKycTitle();
            let fiUpload = []
            data.forEach(e => {
                if (e.is_fi_upload_required === 1) {
                    fiUpload[e.id] = e;

                }


            })

            setFiMustUpload(fiUpload);
            setLoading(false);

        })();
    }, []);

    const onFileChanged = (event) => {
        setFile(event.target.files[0]);
    }

    const onFileSubmit =async ()=>{
        swal({
            icon: "load.gif",
            buttons: false,
        });
        var formdata = new FormData();
        formdata.append(`fi_upload`,JSON.stringify(Object.values(fiMustUpload)));
        formdata.append(`file`,file);
        var created_by = localStorage.getItem("id");
        formdata.append(`created_by`,created_by);
        var bulk = await fiBulkUpload(formdata);
        swal.close();
        if(bulk){
            toast.success("FI Form Uploaded Successfully");
        }else{
            toast.error("FI document Upload Failed");
        }

        props.uploadDone();
        props.toggle();

    }

    return (
        <ModalForm
            modalTitle="Upload File"
            toggle={props.toggle}
            modal={props.modal}
            btnName="Submit"
            handleClick={onFileSubmit}
            size="lg"
        >

          
                {
                    loading ? (
                        <div>
                            <div style={{ textAlign: "center" }}>
                                <Loader type="Rings" color="#00BFFF" height={100} width={100} />
                            </div>
                        </div>
                    ) : (
                    <Card>
                       <Card.Header><div className="row">
                           <div className="col-md-4"><h5>Doc Title</h5></div>
                           <div className="col-md-8"><h5>Required Format</h5></div>
                           </div></Card.Header>
                                <Card.Body>
                                <div>
                                {
                                    fiMustUpload.map((e, i) => {
                                        return <div className="row">
                                            <div className="col-md-4">
                                            <strong>  {e.title}:</strong>
                                            </div>

                                            <div className="col-md-8">
                                                {`Outlet-Code_${e.file_prefix}`}
                                            </div>
                                        </div>
                                    })
                                }
                            
                            </div>
                            <br></br> <br></br>
                            <strong>Must upload zip file  &nbsp; &nbsp;</strong> 
                            <input type="file" accept=".zip" onChange={onFileChanged} />
                                </Card.Body>
                              </Card>  
                          
                        )
                }


           
        </ModalForm>
    );
} 