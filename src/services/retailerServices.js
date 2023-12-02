import axios from 'axios';
import { baseURL } from "../constants/constants";

const GET_FI = baseURL+"get-fi";
const UPDATE_PHONE_NO = baseURL+"single-upload-retailer-phone-number";
const UPLOAD_FILE_Phone_No = baseURL+"bulk-upload-retailer-phone-number";

export async function updateRetailerPhone(outletIds, phone_number){
    let token = localStorage.getItem("token");
    let user_id = localStorage.getItem("id");

    const updatePhone = await axios.post(UPDATE_PHONE_NO,{user_id, outlet_code: outletIds[0], phone_number},
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        }
    )

    if(updatePhone.status===200){
        return updatePhone.data;
    }
}

export function fileUploadPhoneNo(file) { 
    const token = localStorage.getItem('token');
    var formData = new FormData();
    formData.append('file',file);
    formData.append('user_id',localStorage.getItem('id'));
    const config = {
        headers: { 
            Authorization: `Bearer ${token}`,
            'content-type': 'multipart/form-data'
        },
    };
    return axios.post(UPLOAD_FILE_Phone_No,formData, config);
}