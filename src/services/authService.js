import http from "./httpService";
import axios from 'axios';
//import { apiUrl } from "../config.json";

import jwtDecode from "jwt-decode";
import { baseURL } from "./../constants/constants";

const apiEndPoint = baseURL + "login";
const commonLoginURL = baseURL + "common_login";
const tokenKey = "token";
const CHANGE_FILE_URL = baseURL+'change-pass';
const DH_ID_BASED_ON_FI_URL = baseURL+'get-dh-by-fi';

export async function login(email, password) {
	try {
	  const { data } = await http.post(apiEndPoint, { email, password });
	  localStorage.setItem("token", data["token"]);
	  localStorage.setItem("id", data["id"]);
	  localStorage.setItem("permitted_menu_tree", data["permitted_menu_tree"]);
	  localStorage.setItem("dpids", data.dpids);
	  localStorage.setItem("cr_user_type", data.cr_user_type);
	  localStorage.setItem("setting_menu", data.setting_menu);
	  localStorage.setItem("dh_id", data.dh_id);
	  localStorage.setItem("fi_id", data.id_fi);
	  localStorage.setItem("permitted_fi", JSON.stringify(data?.permitted_fi[0]));
	  localStorage.setItem("fi_info", JSON.stringify(data?.fi_info));

	  return data;
	} catch(error) {
		console.log(error.message);
	}
}

export async function commonLogin(email, password, login_type, user_type) {
  const { data } = await http.post(commonLoginURL, { email, password, login_type, user_type });

  localStorage.setItem("token", data["token"]);
  localStorage.setItem("id", data["id"]);
  localStorage.setItem("permitted_menu_tree", data["permitted_menu_tree"]);
  localStorage.setItem("dpids", data.dpids);
  localStorage.setItem("cr_user_type", data.cr_user_type);
  localStorage.setItem("setting_menu", data.setting_menu);
  localStorage.setItem("dh_id", data.dh_id);
  localStorage.setItem("fi_id", data.id_fi);
  return data;
}

export function getCurrentUser() {
  try {
    const token = localStorage.getItem(tokenKey);
    if (token !== null) {
      const user = jwtDecode(token);
      return user;
    } else return null
  } catch (error) {
    return null;
  }
}

export function getDhId() {
  try {
    const dh_id = localStorage.getItem("dh_id");
    // const user = jwtDecode(token);
    return dh_id;
  } catch (error) {
    return null;
  }
}

export async function getDhIdBasedOnFi(selectedFi) {
  try {
    const user_id = localStorage.getItem("id");
    const user_type = localStorage.getItem("cr_user_type");

    const {data} = await axios.post(DH_ID_BASED_ON_FI_URL, {fi_id: selectedFi, user_id, user_type});
    return data;
  } catch (error) {
    return null;
  }
}

export function getUserId() {
  try {
    const id = localStorage.getItem("id");
    // const user = jwtDecode(token);
    return id;
  } catch (error) {
    return null;
  }
}
export function getUserType() {
  try {
    const type = localStorage.getItem("cr_user_type");
    // const user = jwtDecode(token);
    return type;
  } catch (error) {
    return null;
  }
}
export function logOut() {
  localStorage.removeItem('permitted_fi');
  localStorage.removeItem('fi_info');
  localStorage.removeItem(tokenKey);
  return localStorage.removeItem(tokenKey);
}

/* export function loginWithToken(token){
  return localStorage.setItem(tokenKey,token)
} */

export function getJwt() {
  //return "amar naam mithu";
  return localStorage.getItem(tokenKey);
}

export function changePassword(values) {
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
    return axios.post(CHANGE_FILE_URL,formBody, config);
}

export default {
  getCurrentUser,
  login,
  logOut,
  getJwt,
  getDhId,
  getUserId,
  getUserType,
  /* loginWithToken*/
};
