import axios from 'axios';
import { baseURL } from "../constants/constants";

const GET_LOCATION_URL = baseURL + "get-location-based-on-permission";
const GET_LOCATION_URL_FOR_REPORT = baseURL + "get-location-based-on-permission-for-report";
const GET_LOCATION_URL_DD_TWO = baseURL + "get-locations-fi-di-wise";
const GET_OUTLETS_URL = baseURL + 'get-outlet-by-point';

export async function getLocations(selectedFi) {
  try {
    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const user_type = localStorage.getItem("cr_user_type");
    const fi_id = selectedFi;
    const json_obj = {
        user_id, user_type, fi_id
    }
    const locations = await axios.post(GET_LOCATION_URL, json_obj, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: "Bearer " + token
        }
    });
    const data = locations.data;
    if(data.success){
        return data.data;
    }
  } catch (error) {
      console.log(error);
  }
}

export async function getOutlets(dpids) {
    try {
        const user_id = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        const json_obj = { user_id, dpids }
        const locations = await axios.post(GET_OUTLETS_URL, json_obj, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: "Bearer " + token
            }
        });
        const data = locations.data;
        if(data.success){
            return data.data;
        }
    } catch (error) {
        console.log(error);
    }
}

export async function getLocationsForReport(selectedFi) {
  try {
    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const user_type = localStorage.getItem("cr_user_type");
    const fi_id = selectedFi;
    const json_obj = {
        user_id, user_type, fi_id
    }
    const locations = await axios.post(GET_LOCATION_URL_FOR_REPORT, json_obj, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: "Bearer " + token
        }
    });
    const data = locations.data;
    if(data.success){
        return data.data;
    }
  } catch (error) {
      console.log(error);
  }
}

export async function getLocationsForDropDownTwo(selectedFi) {
  try {
    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const user_type = localStorage.getItem("cr_user_type");
    const fi_id = selectedFi;
    const json_obj = {
        user_id, user_type, fi_id
    }
    const locations = await axios.post(GET_LOCATION_URL_DD_TWO, json_obj, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: "Bearer " + token
        }
    });
    const data = locations.data;
    if(data.success){
        return data.data;
    }
  } catch (error) {
      console.log(error);
  }
}

export function formatNumber(number) {
    let fixed = parseFloat(number).toFixed(1);
    return parseFloat(fixed)?.toLocaleString('en-US');
}

export function formatCurrency(number) {
    let formatedValue;
    if (number >= 1000000) {
        let value = parseFloat(number/1000000).toFixed(1);
        formatedValue = `৳ ${parseFloat(value)?.toLocaleString('en-US')} M`
    } else if (number >= 1000) {
        let value = parseFloat(number/1000).toFixed(1);
        formatedValue = `৳ ${parseFloat(value)?.toLocaleString('en-US')} K`
    } else {
        let value = parseFloat(number).toFixed(1);
        formatedValue = `৳ ${parseFloat(value)?.toLocaleString('en-US')}`
    }

    return formatedValue;
}