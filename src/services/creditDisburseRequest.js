import http from "./httpService";

import { baseURL } from "./../constants/constants";

const credit_list_for_disbursement_url =
  baseURL + "get-credit-list-for-disbursement";
const post_credit_disbursement_request_by_dh_url =
  baseURL + "credit-disbursement-request-by-dh";

export async function getCreditLimitDisbursement(obj) {
  try {
    const { data } = await http.post(credit_list_for_disbursement_url, obj);
    return data
      ? { total_amount: data["total_amount"], list: data["data"] }
      : "No data found";
  } catch (error) {
    console.log("error", error);
    return error.message;
  }
}

export async function postCreditLimitDisbursement(obj) {
  try {
    const { data } = await http.post(
      post_credit_disbursement_request_by_dh_url,
      obj
    );
    return data ? data["message"] : "No data found";
  } catch (error) {
    console.log("error", error);
    return error.message;
  }
}

export default {
  getCreditLimitDisbursement,
  postCreditLimitDisbursement,
};
