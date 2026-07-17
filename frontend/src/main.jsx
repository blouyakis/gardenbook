import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import BaseTemplate from "./pages/BaseTemplate.jsx";
import HomePage from "./pages/HomePage.jsx";
import MyGardenPage from "./pages/MyGardenPage.jsx";
import ExplorePage from "./pages/ExplorePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import GardensPage from "./pages/GardensPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BaseTemplate>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/mygarden"
              element={
                <RequireAuth>
                  <MyGardenPage />
                </RequireAuth>
              }
            />
            <Route
              path="/mygarden/:gardenId"
              element={
                <RequireAuth>
                  <MyGardenPage />
                </RequireAuth>
              }
            />
            <Route
              path="/gardens"
              element={
                <RequireAuth>
                  <GardensPage />
                </RequireAuth>
              }
            />
            <Route
              path="/settings"
              element={
                <RequireAuth>
                  <SettingsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/explore"
              element={
                <RequireAuth>
                  <ExplorePage />
                </RequireAuth>
              }
            />
          </Routes>
        </BaseTemplate>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
