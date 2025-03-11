// eslint-disable-next-line no-unused-vars
import React from "react";
import ReactDOM from "react-dom/client";
import AppWrapper from "./AppWrapper";
import "./index.css"; // Ensure this import is correct

// Using the AppWrapper component that combines Redux Provider and React Router
ReactDOM.createRoot(document.getElementById("root")).render(<AppWrapper />);
