import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/homePage/HomePage";
import MainLayout from "../layouts/MainLayout";
import CharacterPage from "../pages/character/CharacterPage.jsx";
import CubeExpectation from "../components/cubeCalculator/CubeExpectation";
import StarforceExpectation from "../components/starforceCalculator/StarforceExpectation";
import DeviceFrame from "../components/device/DeviceFrame";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="character/:characterName" element={<CharacterPage />} />
        </Route>

          <Route
              path="character/:characterName"
              element={<CharacterPage />}
          />

        <Route
          path="/cube"
          element={
            <DeviceFrame>
              <CubeExpectation />
            </DeviceFrame>
          }
        />

        <Route
          path="/starforce"
          element={
            <DeviceFrame>
              <StarforceExpectation />
            </DeviceFrame>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}