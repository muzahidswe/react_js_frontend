import axios from 'axios';
import { baseURL } from "../constants/constants";

const SUBMIT_FILE = baseURL+'upload-credit-limit-file';
const SUBMIT_FILE_SCOPE_OUTLET = baseURL+'upload-scope-outlets';
const SUBMIT_FILE_RETAILER_INFO_UPLOAD = baseURL+'upload-retailer-nid-info';
const SUBMIT_FILE_DOC_SUBMITTED = baseURL+'doc-submit-to-fi';
const SUBMIT_FILE_REVIEW_OLD_CREDIT_LIMIT = baseURL+'upload-review-old-credit-limit';
const SUBMIT_FILE_BULL_KYC_APPROVE = baseURL+'upload-bulk-kyc-approve';
const SUBMIT_FILE_OUTLET_INFO = baseURL+'upload-outlet-info';

export function fileSubmitScopeoutlet(file) { 
    const token = localStorage.getItem('token');
    var formData = new FormData();
    formData.append('file',file);
    formData.append('id_dh',localStorage.getItem('dh_id'));
    formData.append('user_id',localStorage.getItem('id'));
    const config = {
        headers: { 
            Authorization: `Bearer ${token}`,
            'content-type': 'multipart/form-data'
        },
    };
    return axios.post(SUBMIT_FILE_SCOPE_OUTLET,formData, config);
}

export function fileSubmitRetailerNIDInfoUpload(file) { 
    const token = localStorage.getItem('token');
    var formData = new FormData();
    formData.append('file',file);
    formData.append('id_dh',localStorage.getItem('dh_id'));
    formData.append('user_id',localStorage.getItem('id'));
    const config = {
        headers: { 
            Authorization: `Bearer ${token}`,
            'content-type': 'multipart/form-data'
        },
    };
    return axios.post(SUBMIT_FILE_RETAILER_INFO_UPLOAD,formData, config);
}

export function fileSubmitBulkKYCApprove(file) { 
    const token = localStorage.getItem('token');
    var formData = new FormData();
    formData.append('file',file);
    formData.append('id_dh',localStorage.getItem('dh_id'));
    formData.append('user_id',localStorage.getItem('id'));
    const config = {
        headers: { 
            Authorization: `Bearer ${token}`,
            'content-type': 'multipart/form-data'
        },
    };
    return axios.post(SUBMIT_FILE_BULL_KYC_APPROVE,formData, config);
}

export function fileSubmitOutletInfo(file) { 
    const token = localStorage.getItem('token');
    var formData = new FormData();
    formData.append('file',file);
    formData.append('id_dh',localStorage.getItem('dh_id'));
    formData.append('user_id',localStorage.getItem('id'));
    const config = {
        headers: { 
            Authorization: `Bearer ${token}`,
            'content-type': 'multipart/form-data'
        },
    };
    return axios.post(SUBMIT_FILE_OUTLET_INFO,formData, config);
}

export function fileSubmitReviewOldCreditLimit(file) { 

    const token = localStorage.getItem('token');

    var formData = new FormData();

    formData.append('file',file);

    formData.append('id_dh',localStorage.getItem('dh_id'));

    formData.append('user_id',localStorage.getItem('id'));

    const config = {

        headers: { 

            Authorization: `Bearer ${token}`,

            'content-type': 'multipart/form-data'

        },

    };

    return axios.post(SUBMIT_FILE_REVIEW_OLD_CREDIT_LIMIT,formData, config);

}

export function fileSubmitDocSubmitted(file) { 
    const token = localStorage.getItem('token');
    var formData = new FormData();
    formData.append('file',file);
    formData.append('id_dh',localStorage.getItem('dh_id'));
    formData.append('user_id',localStorage.getItem('id'));
    const config = {
        headers: { 
            Authorization: `Bearer ${token}`,
            'content-type': 'multipart/form-data'
        },
    };
    return axios.post(SUBMIT_FILE_DOC_SUBMITTED,formData, config);
}

export function fileSubmit(values, file, status, cr_retail_limit_info_id){
    const token = localStorage.getItem('token');
    var formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
        if (key != 'status') {
            if (key == 'file') {
                formData.append(key,file);
            }else{
                formData.append(key,value);
            }
        }        
    }
    formData.append('id_fi',localStorage.getItem('fi_id'));
    formData.append('status', status);
    formData.append('created_by', localStorage.getItem('id'));
    formData.append('cr_retail_limit_info_id', cr_retail_limit_info_id)
    const config = {
        headers: { 
            Authorization: `Bearer ${token}`,
            'content-type': 'multipart/form-data'
        },
    };
    const user_id = localStorage.getItem("id");
    return axios.post(SUBMIT_FILE,formData, config);
}