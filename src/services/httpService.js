import axios from "axios";
import auth from "./authService";

axios.defaults.headers.common = {
  Authorization: `bearer ${localStorage.getItem("token")}`,
};
axios.interceptors.response.use(null, (error) => {
  const exptErr =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (!exptErr) {
    console.log("Unexpected error : ", error);
    // toast.error('An unexpected error occur')
  }
  if (error.response) {
    console.log("error happen");
  }
  return Promise.reject(error);
});
/* axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      console.log("401 happen");
    }
    return Promise.reject(error);
  }
); */

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
