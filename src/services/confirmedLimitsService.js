import http from "./httpService";

import axios from "axios";
import qs from "qs";
import { baseURL } from "./../constants/constants";

const limitConfirmedCreditsUrl = baseURL + "limit-confirmed-credits";

export async function getConfirmedLimitLists(obj) {
  try {
    const { data } = await http.post(limitConfirmedCreditsUrl, obj);
    return data ? data["data"] : "No data found";
  } catch (error) {
    console.log("error", error);
    return error.message;
  }
}

export default {
  getConfirmedLimitLists,
};
