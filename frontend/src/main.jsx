import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import "./styles/style.css";
import App from "./app/App";
import { Provider } from "react-redux";
import store from "./app/store";
import { BrowserRouter } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import 'antd';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  </BrowserRouter>
);
