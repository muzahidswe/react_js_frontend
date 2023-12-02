import http from "./httpService";

import { baseURL } from "./../constants/constants";
import axios from "axios";

const collectionSettlementDetailsUrl =
  baseURL + "get-collection-settlement-details";

const collectionSettlementRequestUrl = baseURL + "requested-collections-by-dh";
const collectionSettlementConfirmUrl =
  baseURL + "collection-settlement-confirm-by-fi";
const collectionSettlementRejectUrl = baseURL + "collection-settlement-reject-by-fi";
//get-transaction-disbursement-details
export async function getCollectionSettlementDetails(obj) {
  try {
    const { data } = await http.post(collectionSettlementDetailsUrl, obj);
    return data
      ? { total_amount: data["total_amount"], list: data["data"] }
      : "No data found";
  } catch (error) {
    console.log("error", error);
    return error.message;
  }
}

export async function getCollectionSettlementRequest(obj) {
  try {
    const { data } = await http.post(collectionSettlementRequestUrl, obj);
    return data
      ? /* { total_amount: data["total_amount"], list: data["data"] } */ data[
          "data"
        ]
      : "No data found";
  } catch (error) {
    console.log("error", error);
    return error.message;
  }
}

export async function postCollectionSettlementConfirm(id) {
  try {
    const { data } = await http.post(collectionSettlementConfirmUrl, { id , user_id: localStorage.getItem('id')});
    return data ? data["message"] : "No data found";
  } catch (error) {
    console.log("error", error);
    return error.message;
  }
}

export async function postCollectionSettlementReject(values) {
  try {
    const token = localStorage.getItem('token');
    var formBody = [];
    for (var property in values) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(values[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody.push(encodeURIComponent("user_id") + "=" + encodeURIComponent(localStorage.getItem("id")));
    formBody = formBody.join("&");
    const config = {
        headers: { 
            Authorization: `Bearer ${token}`,
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
    };
    return axios.post(collectionSettlementRejectUrl,formBody, config);
  } catch (error) {
    console.log("error", error);
    return error.message;
  }
}



export async function getCollectionSettlementDetailsForFi(dh_id, date) {

  const token = localStorage.getItem('token');
  const fd = {dh_id,date}

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
  return axios.post(collectionSettlementDetailsUrl, formBody, config);
}

export default {
  getCollectionSettlementDetails,
  getCollectionSettlementRequest,
  postCollectionSettlementConfirm,
  getCollectionSettlementDetailsForFi
};
