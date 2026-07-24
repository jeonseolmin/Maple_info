import "./Header.css";

export default function Header() {
    return (
        <header className="site-header">
            <strong className="site-logo">MapleInfo</strong>

            <nav className="site-nav">
                <a href="/">홈</a>
                <a href="/character">캐릭터</a>
                <a href="/ranking">랭킹</a>
                <a href="/community">커뮤니티</a>
            </nav>

            <button type="button" className="login-button">
                로그인
            </button>
        </header>
    );
}