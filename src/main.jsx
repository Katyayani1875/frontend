import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n"; // Import i18n instance before rendering App
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext"; // make sure this exists
import 'react-toastify/dist/ReactToastify.css';
import "./index.css"; // Tailwind or global styles
import "@fontsource/poppins";
import axios from "axios"; // import axios


axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);
