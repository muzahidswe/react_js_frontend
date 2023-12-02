import http from "./httpService";
import axios from 'axios';
import { baseURL } from "../constants/constants";

const SUBMIT_USER = baseURL+'create-user';
const USER_LIST_URL = baseURL+'userList';
const USER_DELETE_URL = baseURL+'user-delete';

export function userSubmit(values,crUserType,id_dh,id_fi){
    const token = localStorage.getItem('token');
    var formBody = [];
    for (var property in values) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(values[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody.push(encodeURIComponent("created_by") + "=" + encodeURIComponent(localStorage.getItem("id")));
    formBody.push(encodeURIComponent("cr_user_type") + "=" + encodeURIComponent(crUserType));
    formBody.push(encodeURIComponent("id_dh") + "=" + id_dh);
    formBody.push(encodeURIComponent("id_fi") + "=" + encodeURIComponent(id_fi));
    formBody = formBody.join("&");
    const config = {
        headers: { 
            Authorization: `Bearer ${token}`,
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
    };
    return axios.post(SUBMIT_USER,formBody, config);
}

export async function getUserListService() { 
    try {
        const { data } = await http.get(USER_LIST_URL);
        return data["data"];
    } catch (error) {
        console.log("error from dh wise list ", error);
        return error.message;
    }
}

export async function deleteUserService (id) {
    try {
        const { data } = await http.get(USER_DELETE_URL + '/' + id);
        return data;
    } catch (error) {
        console.log("Error", error);
        return error;
    }
}