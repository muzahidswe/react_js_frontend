import React from "react";
import auth from "../../services/authService";
import { Route, Redirect } from "react-router-dom";

const Root = ({ component: Component, render, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!auth.getCurrentUser()) return <Redirect to="/login" />;

        return <Redirect to="/dashboard_v3" />;
      }}
    />
  );
};

export default Root;
