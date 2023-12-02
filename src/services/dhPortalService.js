import http from "./httpService";
import { apiUrl } from "../config.json";
import { useEffect } from "react";
import { baseURL } from "./../constants/constants";

const post_fi_dh_mapping_url = baseURL + "insert-dh-fi-mapping";
const dhListUrl = baseURL + "get-dh";
const dhWiseFileListUrl = baseURL + "dhwise-filist";

export async function postFiDhMapping(json) {
  try {
    const { data } = await http.post(post_fi_dh_mapping_url, json);
    return data;
  } catch (error) {
    console.log("error from fi dh mapping ", error);
    return error.message;
  }
}

export async function getDhWiseList() {
  try {
    const { data } = await http.get(dhWiseFileListUrl);
    return data["data"];
  } catch (error) {
    console.log("error from dh wise list ", error);
    return error.message;
  }
}

export async function getDh() {
  try {
    const { data } = await http.get(dhListUrl);
    if (!Object.keys(data["data"]).length) throw new Error("No data Found");
    const dhList = data["data"].map((dhl) => {
      let dh = {};
      dh.value = dhl.id;
      dh.label = dhl.name;
      return dh;
    });
    return dhList;
  } catch (error) {
    return error.message;
  }
}

/* export async function updateFi(fiRow) {
  const { data } = await http.post(updateFiListUrl, fiRow);

  return data["message"];
} */
/* 
export async function deleteFi(id) {
  const { data } = await http.post(deleteFiListUrl, { id });

  return data["message"];
} */

/* export async function getKyc(object) {
  const { data } = await http.post(getKycUrl, object);

  return data["data"]?.result;
} */

export default {
  getDh,
  postFiDhMapping,
  getDhWiseList,
};
