import http from "./httpService";

import { baseURL } from "./../constants/constants";

const collection_settlement_list_for_dh_url =
  baseURL + "get-collection-settlement-list-for-dh";
const post_collection_settlement_request_by_dh_url =
  baseURL + "collection-settlement-request-by-dh";

export async function getCollectionSettlementListForDh(obj) {
  try {
    const { data } = await http.post(
      collection_settlement_list_for_dh_url,
      obj
    );
    return data
      ? { total_amount: data["total_amount"], list: data["data"] }
      : "No data found";
  } catch (error) {
    console.log("error", error);
    return error.message;
  }
}

export async function postCollectionSettlementRequestByDh(formData) {
  try {
    const { data } = await http.post(
      post_collection_settlement_request_by_dh_url,
      formData
    );
    return data ? data["message"] : "No data found";
  } catch (error) {
    console.log("error", error);
    return error.message;
  }
}

export default {
  getCollectionSettlementListForDh,
  postCollectionSettlementRequestByDh,
};
