import React, { useState } from "react";
import { toast } from "react-toastify";

import { login } from "../services/authService";
import { useAlert } from "react-alert";

const initState = {
  email: "",
  password: "",
};
function Login(props) {
  const [value, setValue] = useState(initState);
  const toast = useAlert();

  const handleChange = (name, value) => {
    setValue((prevState) => {
      return { ...prevState, [name]: value };
    });
  };
  const handleValidation = () => {
    if (value.password === "" || value.email === "") {
      toast.error("Field can't be empty");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    //toast("login");
    if (!handleValidation()) return;
    try {
      const status = await login(value.email, value.password);
      if (status.result) {
        toast.success("Successfully Login");
        //props.history.replace("/");
        localStorage.setItem("selected_menu", "Dashboard");
        localStorage.setItem("selected_parent_menu", "");
        window.location = "/";
      } else toast.error("This credentials does not match our record.");
      props.history.push("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="d-flex flex-column flex-root">
      <div
        className="login login-4 login-signin-on d-flex flex-row-fluid"
        id="kt_login"
        style={{ height: "100vh" }}
      >
        <div
          className="d-flex flex-center flex-row-fluid bgi-size-cover bgi-position-top bgi-no-repeat"
          style={{ backgroundImage: 'url("assets/media/bg/bg-3.jpg")' }}
        >
          <div className="login-form text-center p-7 position-relative overflow-hidden">
            <div className="d-flex flex-center mb-15">
              <a href="#">
                <img
                  src="assets/media/logos/unnoti_logo.png"
                  className="max-h-120px"
                  alt
                />
              </a>
            </div>
            <div className="login-signin">
              <div className="mb-20">
                <h3>Sign In</h3>
                <div className="text-muted font-weight-bold">
                  Enter your details to login to your account:
                </div>
              </div>
              <form onSubmit={handleSubmit} id="kt_login_signin_form">
                <div className="form-group mb-5">
                  <input
                    className="form-control h-auto form-control-solid py-4 px-8"
                    type="text"
                    placeholder="Username"
                    name="email"
                    autoComplete="off"
                    value={value.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="form-group mb-5">
                  <input
                    className="form-control h-auto form-control-solid py-4 px-8"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={value.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                </div>
                <button
                  id="kt_login_signin_submit"
                  form="kt_login_signin_form"
                  className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
                  type="submit"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
