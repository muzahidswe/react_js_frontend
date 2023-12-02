import axios from 'axios';
//import { apiUrl } from "../config.json";
import { baseURL } from "../../constants/constants";
const placesURL = "https://prism360.net/getAllPlacesbyUserId/";
const placementMemoURL = "http://13.67.109.109:3001/placement";
const GET_LOCALTION_URL = baseURL + "get-location-based-on-permission";
const DASHBOARD_URL = baseURL+'get-dashboard-data-v2';

export async function getPlaces(){
  try {
    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const user_type = localStorage.getItem("cr_user_type");
    const fi_id = localStorage.getItem("fi_id");
    const json_obj = {
        user_id, user_type, fi_id
    }
    const locations = await axios.post(GET_LOCALTION_URL, json_obj, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: "Bearer " + token
        }
    });
    const data = locations.data;
    if(data.success){
        return data.data;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getPlacementMemos(date){
  try {
    const response = await axios.get(`${placementMemoURL}?dpid=1&date=${date}&prids=2,3`);
    if(response.status==200){
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
}

// export async function editAssignment(dataObject) {
//   try {
//     const response = await http.post(editAssignmentUrl, dataObject);

//     if (response.status == 200) {
//       var data = response.data;

//       if (!data.error && data.success) {
//         return 1;
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }
export async function dashboardData(dpIds, dateRange){
    const token = localStorage.getItem('token');
    const config = {
        headers: { 
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
        },
    };

    dpIds.length === 0 ? dpIds=localStorage.getItem('dpids').split(",") : dpIds=dpIds; 
    const data = await axios.post(DASHBOARD_URL, {dpIds, dateRange}, config);
    return data.data;
}

export default {
  getPlaces,
  getPlacementMemos
};
