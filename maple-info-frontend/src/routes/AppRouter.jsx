import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/homePage/HomePage";
import MainLayout from "../layouts/MainLayout";
import CharacterPage from "../pages/character/CharacterPage.jsx";
import CubeExpectation from "../components/cubeCalculator/CubeExpectation";
import StarforceExpectation from "../components/starforceCalculator/StarforceExpectation";
// 🌟 밖으로 빼두었던 Header와 DeviceFrame import는 지워도 됩니다. (MainLayout이 알아서 처리해줍니다)

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          
          <Route index element={<HomePage />} />
          <Route path="character/:characterName" element={<CharacterPage />} />
          
          <Route path="cube" element={<CubeExpectation />} />
          <Route path="starforce" element={<StarforceExpectation />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}