import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/homePage/HomePage";
import MainLayout from "../layouts/MainLayout";
import CharacterPage from "../pages/character/CharacterPage.jsx";


export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route index element={<HomePage />} />

                    <Route
                        path="character/:characterName"
                        element={<CharacterPage />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}