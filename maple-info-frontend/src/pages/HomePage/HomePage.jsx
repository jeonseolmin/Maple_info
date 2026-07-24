import HeroSection from "../../components/home/HeroSection";
import "./HomePage.css";

export default function HomePage() {
    return (
        <div className="home-page">
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
        </div>
    );
}