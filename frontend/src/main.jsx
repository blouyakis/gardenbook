import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import BaseTemplate from "./pages/BaseTemplate.jsx";
import HomePage from "./pages/HomePage.jsx";
import MyGardenPage from "./pages/MyGardenPage.jsx";
import ExplorePage from "./pages/ExplorePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <StrictMode>
    {}
    <BrowserRouter>
      <BaseTemplate>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mygarden" element={<MyGardenPage />} />
          <Route path="/mygarden/:gardenId" element={<MyGardenPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BaseTemplate>
    </BrowserRouter>
  </StrictMode>
);
