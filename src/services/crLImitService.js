import http from "./httpService";
import { apiUrl } from "../config.json";
import { baseURL } from "./../constants/constants";
import axios from "axios";

const postCrLimitConfigUrl = baseURL + "insert-credit-config";
const getCrLimitConfigListUrl = baseURL + "cr-limit-config-list";
const deleteConfigUrl = baseURL + "delete-cr-limit-config";
const UPDATE_CONFIG_URL = baseURL+'edit-config-limit';
const UPLOAD_FILE_CR_LIMIT_BY_OUTLET = baseURL+'insert-credit-config-by-outlet';
export async function postCrLimitConfig(json) {
  try {
    const { data } = await http.post(postCrLimitConfigUrl, json);
    return data;
  } catch (error) {
    console.log("error from cr limit config", error);
    return error;
  }
}

export async function deleteConfigService(id) {
    try {
        const { data } = await http.get(deleteConfigUrl + '/' + id);
        return data;
    } catch (error) {
        console.log("error from cr limit config", error);
        return error;
    }
}

export async function getCrLimitConfig(json) {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.post(getCrLimitConfigListUrl, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return data["data"];
  } catch (error) {
    console.log("error from cr limit config list", error);
    return error.message;
  }
}

export async  function limitUpdate (values) {
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
    return axios.post(UPDATE_CONFIG_URL,formBody, config);
}

export async function fileUploadCrLimitByOutlet(file) { 
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
  return await axios.post(UPLOAD_FILE_CR_LIMIT_BY_OUTLET,formData, config);
}

export default {
  postCrLimitConfig,
  getCrLimitConfig,
};
