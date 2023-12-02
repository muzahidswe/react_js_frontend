import http from "./httpService";

import { baseURL } from "./../constants/constants";
import axios from 'axios';
const disbursementHistoryUrl = baseURL + "get-credit-list-for-fi-disbursement";
const rejectDisbursementUrl = baseURL + "credit-reject-by-fi";
const creditDisburseUrl = baseURL + "credit-disburse-by-fi";
const dhDisbursementRequestUrl = baseURL + "requested-disbursements-by-dh";
const dhIssueRaisedUrl = baseURL + "raise-dh-issue";
const requestedCollectionsByDhURL = baseURL + "requested-collections-by-dh";
const tokenKey = "token";

export async function getDisbursementHistoryList(data_v) {
    const { data } = await http.post(disbursementHistoryUrl, data_v);
    return data["data"];
}

export async function requestedCollectionsByDh(data_v) {
    const { data } = await http.post(requestedCollectionsByDhURL, data_v);
    return data["data"];
}

export async function rejectDisbursementRequest(id, rejectionReason) {
    const { data } = await http.post(rejectDisbursementUrl, {id, rejectionReason});
    return data["data"];
}

export async function setCreditDisburse(form_data) {
    const { data } = await http.post(creditDisburseUrl, form_data);
    return data["data"];
}

export async function dhDisbursementList(data_v) {
    const { data } = await http.post(dhDisbursementRequestUrl, data_v);
    return data["data"];
}

export async function setDhIssue(id, user_id, issue_comment) {    
    const token = localStorage.getItem('token');
    const fd = {id,user_id,issue_comment}
    
    var formBody = [];
    for (var property in fd) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(fd[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    const config = {
        headers: { 
            Authorization: `Bearer ${token}`,
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
    };
    return axios.post(dhIssueRaisedUrl, formBody, config);
}


export default {
    getDisbursementHistoryList,
    requestedCollectionsByDh,
    setCreditDisburse,
    setDhIssue,
    dhDisbursementList
};
