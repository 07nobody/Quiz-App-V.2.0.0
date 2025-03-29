import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import "./index.css";
import App from "./App";
import "antd/dist/reset.css";  // Replace the outdated antd.min.css import
import store from "./redux/store";
import { MessageProvider } from "./components/MessageProvider";
import { unregisterServiceWorker } from "./serviceWorkerRegistration";

// Unregister any existing service workers to prevent workbox errors
unregisterServiceWorker();

// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: '#4361ee',
    colorLink: '#4361ee',
    borderRadius: 6,
  },
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <ConfigProvider theme={theme}>
      <MessageProvider>
        <App />
      </MessageProvider>
    </ConfigProvider>
  </Provider>
);
