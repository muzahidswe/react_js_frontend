import http from "./httpService";

import { baseURL } from "./../constants/constants";
import axios from 'axios';
const salesReportUpload = baseURL + "upload-sales-file";
const tokenKey = "token";
const disbursementListUrl = baseURL + "disbursements";

export function uploadSalesFile(formData){

    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'multipart/form-data'
        },
    };
    return axios.post(salesReportUpload,formData, config);
}

export async function getDisbursements(obj) { 
    try {
        const { data } = await http.post(disbursementListUrl, obj);
        return data ? data["data"] : "No data found";
    } catch (error) {
        console.log("error", error);
        return error.message;
    }
 }