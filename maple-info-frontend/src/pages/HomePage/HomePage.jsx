import DeviceFrame from "../../components/layout/DeviceFrame";
import Header from "../../components/layout/Header.jsx";
import HeroSection from "../../components/home/HeroSection.jsx";
import "./HomePage.css";

export default function HomePage() {
    return (
        <DeviceFrame>
            <Header />

            <main className="home-page">
                <HeroSection />

                <section className="home-dashboard">
                    <article className="dashboard-card">
                        실시간 인기 캐릭터
                    </article>

                    <article className="dashboard-card">
                        오늘의 이벤트
                    </article>

                    <article className="dashboard-card">
                        공지사항
                    </article>
                </section>
            </main>
        </DeviceFrame>
    );
}