import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "next/app";
import { createBrowserRouter } from "react-router-dom";
import Home from "./page";

const router = createBrowserRouter([
    {path:"/", element: <Home></Home>}
]);

