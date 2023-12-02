import React, { useState, useEffect } from "react";
import auth from "../../services/authService";
import { Route, Redirect, useHistory } from "react-router-dom";
import { baseURL } from "../../constants/constants";
import axios from "axios";
import swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const verifyTokenURL = baseURL+'verify-token';

const ProtectedRoute = ({ component: Component, render, ...rest }) => {
  const history = useHistory();

  const checkVerification = async () => {
    const token = localStorage.getItem('token');
    // const token = '8973264289734629346sdfgkasjhgasdf76238gsdif7824';

    const config = {
      headers: { 
          Authorization: `Bearer ${token}`
      },
    };

    try {
      let verified = await axios.post(verifyTokenURL, null, config);
      if (verified?.data?.message === 'Verified') {
        return true
      } else if (verified?.data?.message === 'Forbidden') {
        localStorage.removeItem('token')
        history.push('/login')
        return false
      }
    } catch (error) {
      console.log('Verify token error', error)
      swal.fire({
        position: 'bottom-end',
        timer: 4000,
        text: 'Network Connection Failed!',
        icon: 'error',
        showConfirmButton: false,

      })
    }
  }
  
  return (
    <>
      <Route
        {...rest}
        render={(props) => {
          if (!checkVerification()) return <Redirect to="/login" />;
          return Component ? <Component {...props} /> : render(props);
        }}
      />
    </>
  );
};

export default ProtectedRoute;
