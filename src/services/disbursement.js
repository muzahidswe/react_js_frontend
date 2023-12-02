import http from "./httpService";

import { baseURL } from "./../constants/constants";

const transactionDisbursementDetailsUrl =
  baseURL + "get-transaction-disbursement-details";

export async function getTransactionDisbursementDetails(obj) {
  try {
    const { data } = await http.post(transactionDisbursementDetailsUrl, obj);
    return data
      ? { total_amount: data["total_amount"], list: data["data"] }
      : "No data found";
  } catch (error) {
    console.log("error", error);
    return error.message;
  }
}

export default {
  getTransactionDisbursementDetails,
};
