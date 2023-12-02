import React from "react";
import auth from "../../services/authService";
import { Route, Redirect } from "react-router-dom";

const LoginCheckRoute = ({ component: Component, render, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (auth.getCurrentUser()) return <Redirect to="/dashboard_v3" />;
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default LoginCheckRoute;
