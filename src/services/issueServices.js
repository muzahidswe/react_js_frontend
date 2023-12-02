import http from "./httpService";

import { baseURL } from "./../constants/constants";
const issueListUrl = baseURL + "raised-issues";
const rejectDisbursementUrl = baseURL + "resolve-issue";

const tokenKey = "token";

export async function getIssueList(data_v) {
    const { data } = await http.post(issueListUrl, data_v);
    return data["data"];
}

export async function issueDisburse(id) {
    const { data } = await http.post(rejectDisbursementUrl, {id});
    return data["data"];
}

export default {
    getIssueList,
    issueDisburse
};
