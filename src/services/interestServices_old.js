import axios from 'axios';
import { baseURL } from "../constants/constants";

const GET_FI = baseURL+"get-fi";
const INSERT_FI = baseURL+"interest-settings";
export async function getFi(){
    const res = await axios.get(GET_FI);
    if(res.status===200){
        var data = res.data;
        if(data.success){
            return data.data;
        }
    }
}

export async function insertFi(fiId,dpids,interestPercentage,serviceChargePercentage,penaltyPercentage){
    let token = localStorage.getItem("token");
    let id = localStorage.getItem("id");

    const insert = await axios.post(INSERT_FI,
        {fi_id:fiId,dpids,interest_percentage:interestPercentage,service_charge_percentage:serviceChargePercentage,penalty_percentage:penaltyPercentage,created_by:id},
        {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        )
    if(insert.status===200){
        if(insert.data.success){
            return 1;
        }
    }

}