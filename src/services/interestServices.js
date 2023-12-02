import axios from 'axios';
import { baseURL } from "../constants/constants";

const GET_FI = baseURL+"get-fi";
const INSERT_FI = baseURL+"interest-settings";
const UPLOAD_FILE_INTEREST = baseURL+'upload-interest-settings';

export async function getFi(){
    const res = await axios.get(GET_FI);
    if(res.status===200){
        var data = res.data;
        if(data.success){
            return data.data;
        }
    }
}

export async function insertFi(fiId,outletIds,interestPercentage,serviceChargePercentage,penaltyPercentage){
    let token = localStorage.getItem("token");
    let id = localStorage.getItem("id");

    const insert = await axios.post(INSERT_FI,
        {fi_id:fiId,outlet_code: outletIds,interest_percentage:interestPercentage,service_charge_percentage:serviceChargePercentage,penalty_percentage:penaltyPercentage,created_by:id},
        {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        )
    if(insert.status===200){
        if(insert.data.success){
            return 1;
        }
    }
}

export function fileUploadInterest(file, fiId) { 
    const token = localStorage.getItem('token');
    var formData = new FormData();
    formData.append('file',file);
    formData.append('user_id',localStorage.getItem('id'));
    formData.append('fi_id',fiId);
    const config = {
        headers: { 
            Authorization: `Bearer ${token}`,
            'content-type': 'multipart/form-data'
        },
    };
    return axios.post(UPLOAD_FILE_INTEREST,formData, config);
}