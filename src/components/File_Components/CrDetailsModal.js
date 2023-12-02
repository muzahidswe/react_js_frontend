import React, { useEffect, useState, Fragment } from "react";
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Loader from "react-loader-spinner";
import swal from 'sweetalert';
//import {useAlert} from "react-alert";

const LOG_URL = baseURL+'limit-confirmed-log-details';
const DOWNLOAD_FILE_URL = baseURL+'download-log-details'

function CrDetailsModal(params) { 
    //const alert = useAlert()

    const [isLoading, setIsLoading] = useState(true);

    const useStyles = makeStyles({
        table: {
            minWidth: 650,
        },
    });

    const createData = (note, date, status, id) => {
        return { note, date, status, id };
    }
    const [rows, setRows] = useState([]);
    const classes = useStyles();    

    const handleDownload = (row) => {
        swal({
            icon: "load.gif",
            buttons: false,
        });
        axios.post(`${DOWNLOAD_FILE_URL}`,{
            id: row.id
        }).then(res => {
            window.open(res?.data?.data, "_blank")
            swal.close();
        }).catch(err => {
            alert.error(err.message);
            swal.close();
        });
    }

    const getDetails = async () => {
        var res = await axios.get(`${LOG_URL}/${params.cr_retail_limit_info_id}`);
        if (res.status == 200 && res.data.success) {
            var temp = [];
            for (let i = 0; i < res.data.data.length; i++) {
                temp.push(createData(res.data.data[i].note, res.data.data[i].created_at, res.data.data[i].status, res.data.data[i].id))                
            }
            setRows(temp);
        }else{
            //alert.error('Data nai')
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getDetails();
    },[]);

    return isLoading ? (<div>
                            <div style={{ textAlign: "center" }}>
                                <Loader type="Rings" color="#00BFFF" height={100} width={100} />
                            </div>
                        </div>) : 
        (<TableContainer  component={Paper}>
        <Table className={classes.table} aria-label="simple table">
            <TableHead className="bg-light-primary">
                <TableRow>
                    <TableCell variant="">Note</TableCell>
                    <TableCell align="right">Date</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="center">Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <TableRow key={row.note}>
                    <TableCell component="th" scope="row">{row.note}</TableCell>
                    <TableCell align="right">{row.date}</TableCell>
                    <TableCell align="right">{row.status}</TableCell>
                    <TableCell align="center">
                        <button
                            className="btn btn-sm btn-clean btn-primary"
                            onClick={() => handleDownload(row)}
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Download Excel File"
                        >
                            <i className=" flaticon-download" />
                        </button>
                    </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
}

export default CrDetailsModal;