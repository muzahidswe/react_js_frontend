import http from "./httpService";

import axios from "axios";
import FileSaver from "file-saver";
import { baseURL } from "../constants/constants";
const downloadNidOutletUrl = baseURL + "download-nid-per-outlet";
const downloadNidHouseUrl = baseURL + "download-nid-per-house";
const previewNidOutletUrl = baseURL + "outlet-image-preview";
const uploadZipUrl = baseURL + "upload-application-form-zip";
const OUTLET_BASED_ON_KYC_UPLOAD =
  baseURL + "get-outlet-count-based-on-doc-upload";
const DOWNLOAD_KYC_OUTLET_INFO = baseURL + "download-kyc-outlet-info";
const GET_KYC_TITLE_FOR_FI = baseURL + "get_kyc_title_for_fi";
const counterUrl = baseURL + "kyc-status-counter";
const UPLOAD_ACCOUNT_FORM = baseURL+"upload-account-form";
const REJECT_KYC = baseURL+"reject-kyc";
const FI_BULK_UPLOAD = baseURL+"fi-bulk-upload";
export async function downLoadNidOutlet(outlet_code) {
  try {
    //outlet_id = 4279120;
    const { data } = await http.get(`${downloadNidOutletUrl}/${outlet_code}`);
    return data["data"];
  } catch (error) {
    console.log("error ", error);
    alert(error);
  }
}

export async function downLoadNidHouse(dpids) {
  try {
    //outlet_id = 4279120;
    const token = localStorage.getItem("token");
    //   const { data } = await http.get(`${downloadNidHouseUrl}/${house_id}`);
    const { data } = await axios.post(downloadNidHouseUrl, { dpids }, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return data["data"];
  } catch (error) {
    console.log("error ", error);
    alert(error);
  }
}

export async function uploadZip(formData) {
  try {
    const response = await http.post(uploadZipUrl, formData);
    if (response.status == 200) {
      var info = response.data;

      var success = info.success;
      if (success) {
        return info.data;
      }
    }
    //return data["message"];
  } catch (error) {
    console.log("error ", error);
  }
}

export async function uploadAccountForm(formData){
  try {
    const response = await http.post(UPLOAD_ACCOUNT_FORM, formData);
    if (response.status == 200) {
      var info = response.data;

      var success = info.success;
      if (success) {
        return true;
      }
    }
    //return data["message"];
  } catch (error) {
    console.log("error ", error);
  }
}

export async function previewNidOutlet(outlet_id) {
  try {
    const { data } = await http.get(`${previewNidOutletUrl}/${outlet_id}`);

    return data["data"];
  } catch (error) {
    console.log("error ", error);
  }
}

export async function getOutletBasedOnDocUpload(dpids) {
  try {
    const token = localStorage.getItem("token");
    const data = await axios.post(
      OUTLET_BASED_ON_KYC_UPLOAD,
      { dpids },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (data.status === 200) {
      var info = data.data;
      if (info.success) {
        return info.data;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getCounter(dpids) {
  try {
    const token = localStorage.getItem("token");
    const data = await axios.post(
      counterUrl,
      {dpids},
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (data.status === 200) {
      var info = data.data;
      if (info.success) {
        return info.data;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export default {
  downLoadNidOutlet,
  downLoadNidHouse,
  previewNidOutlet,
  uploadZip,
  getCounter
};

export async function downloadExcelFileFromService(dpids, phases) {
  try {
    // const dpids = localStorage.getItem("dpids").split(",");
    const token = localStorage.getItem("token");
    var id_fi = null;
    if (typeof  localStorage.getItem("fi_id") !== "undefined") {
        id_fi = localStorage.getItem("fi_id")
    }
    const response = await axios.post(
      DOWNLOAD_KYC_OUTLET_INFO,
      { dpids, phases, id_fi},
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,

        },
      }
    );
    if (response.status === 200) {
      var info = response.data;
      if (info.success) {
        return info.data;
      }
    }
  } catch (error) {

  }
}

export async function getKycTitle() {
  try {
    const id_fi = localStorage.getItem("fi_id");
    const token = localStorage.getItem("token");
    const response = await axios.post(
      GET_KYC_TITLE_FOR_FI,
      { id_fi },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,

        },
      }
    );
    if (response.status === 200) {
      var info = response.data;
      if (info.success) {
      
        return info.data;
      }
    }
  } catch (error) {

  }
}

export async function fiBulkUpload(formData){
  try {
    const response = await http.post(FI_BULK_UPLOAD, formData);
    if (response.status === 200) {
      var info = response.data;

      var success = info.success;
      if (success) {
        return true;
      }
    }
  } catch (error) {
    
  }
}

export async function rejectKyc(id_outlet,reason){
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      REJECT_KYC,
      { id_outlet,reason },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,

        },
      }
    );
    if (response.status === 200) {
      var info = response.data;
      if (info.success) {
      
        return true;
      }
    }
  } catch (error) {

  }
 
}