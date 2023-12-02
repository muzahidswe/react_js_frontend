import http from "./httpService";

import { baseURL } from "./../constants/constants";

const post_fi_institute_url = baseURL + "insert-fi-institute";
const fiListUrl = baseURL + "get-fi";
const updateFiListUrl = baseURL + "edit-fi";
const deleteFiListUrl = baseURL + "delete-fi";
const getKycUrl = baseURL + "get-kyc";
const getDocumentsUrl = baseURL + "get-documents";
const tokenKey = "token";
const fiWiseDocsUrl = baseURL + "get-documents-fi-wise";
const deleteRelationUrl = baseURL + "delete-fi-doc-relation";
const postFiDocMappingUrl =baseURL +  "post-fi-doc-mapping-url"

export async function postFiInstitute(formData, logo) {    
    var fd = new FormData();
    for (const [k, v] of Object.entries(formData)) {
        fd.append(k, v);
    }
    fd.append("logo", logo);
    const config = {
        headers: { 
            'content-type': 'multipart/form-data'
        },
    };
    const { data } = await http.post(post_fi_institute_url, fd, config);

    return data;
}

export async function getFiDetails() {
  const { data } = await http.get(fiListUrl);

  return data["data"];
}
export async function updateFi(fiRow, logo) {
    var fd = new FormData();
    for (const [k, v] of Object.entries(fiRow)) {
        fd.append(k, v);
    }
    fd.append("logo", logo);
    const config = {
        headers: { 
            'content-type': 'multipart/form-data'
        },
    };
  const { data } = await http.post(updateFiListUrl, fd, config);

  return data["message"];
}

export async function deleteFi(id) {
  const { data } = await http.post(deleteFiListUrl, { id });

  return data["message"];
}

export async function getKyc(object) {
  const { data } = await http.post(getKycUrl, object);

  return data["data"];
}

export default {
  postFiInstitute,
  getFiDetails,
  updateFi,
  deleteFi,
  getKyc,
};

export async function getDocuments() {
  try {
    const { data } = await http.get(getDocumentsUrl);
    if (!Object.keys(data["data"]).length) throw new Error("No data Found");
    const docList = data["data"].map((dcl) => {
      let doc = {};
      doc.value = dcl.id;
      doc.label = dcl.title;
      return doc;
    });
    return docList;
  } catch (error) {
    return error.message;
  }
}


export async function getFiWiseDocList() {
  try {
    const { data } = await http.get(fiWiseDocsUrl);
    return data["data"];
  } catch (error) {
    console.log("error from dh wise list ", error);
    return error.message;
  }
}

export async function deleteRelationService(id) {
    try {
        const { data } = await http.get(deleteRelationUrl + '/' + id);
        return data;
    } catch (error) {
        console.log("error from cr limit config", error);
        return error;
    }
}

export async function postFiDocMapping(json) {
    try {
        const { data } = await http.post(postFiDocMappingUrl, json);
        return data["message"];
    } catch (error) {
        console.log("error from fi dh mapping ", error);
        return error.message;
    }
}