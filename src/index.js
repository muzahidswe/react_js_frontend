import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Login from "./components/login";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import Pagination from "./components/pagination";
import Testxcel from "./components/testxcel";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import TopDropdownTwo from "./components/common/TopDropdownTwo";
import './icons';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers';
import thunk from 'redux-thunk';

const store = createStore(reducers, compose(applyMiddleware(thunk), compose))

const options = {
  // you can also just use 'bottom center'
  position: positions.MIDDLE,
  timeout: 10000,
  offset: "30px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AlertProvider template={AlertTemplate} {...options}>
          <App />
        </AlertProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
