import { Outlet } from "react-router-dom";
import DeviceFrame from "../components/device/DeviceFrame";
import Header from "../components/layout/header/Header";
import "./MainLayout.css";
import {useState} from "react";
import AppMenu from "../components/menu/AppMenu.jsx";

export default function MainLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <DeviceFrame>
            <div className="main-layout">
                <Header
                    isMenuOpen={isMenuOpen}
                    onMenuClick={() => setIsMenuOpen((open) => !open)}
                />

                <main>
                    <Outlet />
                </main>

                <AppMenu
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                />
            </div>
        </DeviceFrame>
    );
}