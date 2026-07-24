import { Outlet } from "react-router-dom";
import DeviceFrame from "../components/device/DeviceFrame";
import Header from "../components/layout/Header/Header";
import "./MainLayout.css";

export default function MainLayout() {
    return (
        <DeviceFrame>
            <div className="app-screen">
                <Header />

                <main className="app-scroll-area">
                    <Outlet />
                </main>
            </div>
        </DeviceFrame>
    );
}