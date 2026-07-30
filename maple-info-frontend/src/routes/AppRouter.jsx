import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/homePage/HomePage";
import MainLayout from "../layouts/MainLayout";
import CharacterPage from "../pages/character/CharacterPage.jsx";
import CubeExpectation from "../components/cubeCalculator/CubeExpectation";
import StarforceExpectation from "../components/starforceCalculator/StarforceExpectation";
import ExpCalculator from "../components/expCalculator/ExpCalculator.jsx";
import ExpPointCalculator from "../components/expCalculator/ExpPointCalculator.jsx";
import TreasureHunter from "../components/expCalculator/TreasureHunter.jsx";
import AfkExperience from "../components/expCalculator/AfkExperience.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          
          <Route index element={<HomePage />} />
          <Route path="character/:characterName" element={<CharacterPage />} />
          
          <Route path="cube" element={<CubeExpectation />} />
          <Route path="starforce" element={<StarforceExpectation />} />
          <Route path="experience/hunting" element={<ExpCalculator/>} />
          <Route path="experience/coupon" element={<ExpPointCalculator />} />
          <Route path="experience/treasure-hunter" element={<TreasureHunter/>} />
          <Route path="experience/afk" element={<AfkExperience/>} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}