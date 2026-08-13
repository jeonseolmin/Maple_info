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
import BossScheduler from "../components/bossCalculator/BossScheduler.jsx";
import BossEncyclopedia from "../components/bossinfo/BossEncyclopedia.jsx";
import SymbolCalculator from "../components/symbolCalculator/SymbolCalculator.jsx";
import UnionChampion from "../components/unionChampion/UnionChampion.jsx";
import MuLungDojo from "../components/mulungDojo/MuLungDojo.jsx";

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
          <Route path="boss/scheduler" element={<BossScheduler />} />
          <Route path="/gameinfo/boss" element={<BossEncyclopedia />} />
          <Route path="/symbol" element={<SymbolCalculator />} />
          <Route path="/champion" element={<UnionChampion />} />
          <Route path="/mulung" element={<MuLungDojo />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}