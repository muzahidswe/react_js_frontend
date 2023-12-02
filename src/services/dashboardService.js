import axios from 'axios';
import { baseURL } from "../constants/constants";

const DASHBOARD_URL = baseURL+'get-dashboard-data';

export async function dashboardData(){
    const token = localStorage.getItem('token');
    var dpids = localStorage.getItem('dpids').split(",");
    const config = {
        headers: { 
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
        },
    };
    const data = await axios.post(DASHBOARD_URL, {dpids}, config);
    return data.data;
}