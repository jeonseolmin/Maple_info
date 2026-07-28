import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header({ isMenuOpen, onMenuClick }) {
    const navigate = useNavigate();

    const [characterName, setCharacterName] = useState("");

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme) {
            return savedTheme === "dark";
        }

        return window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
    });

    useEffect(() => {
        document.documentElement.classList.toggle(
            "dark",
            isDarkMode
        );

        localStorage.setItem(
            "theme",
            isDarkMode ? "dark" : "light"
        );
    }, [isDarkMode]);

    const handleSearch = (event) => {
        event.preventDefault();

        const trimmedName = characterName.trim();

        if (!trimmedName) {
            return;
        }

        navigate(`/character/${encodeURIComponent(trimmedName)}`);
    };
    const handleLoginClick = () => {
        /*
         * 아직 /login 라우트가 없기 때문에
         * 로그인 페이지 구현 후 연결합니다.
         *
         * navigate("/login");
         */
    };

    return (
        <header className="site-header">
            <div className="header-left">
                <button
                    type="button"
                    className="menu-button"
                    onClick={onMenuClick}
                    aria-expanded={isMenuOpen}
                    aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4 6h16" />
                        <path d="M4 12h16" />
                        <path d="M4 18h16" />
                    </svg>
                </button>
            </div>

            <form
                className="header-search"
                onSubmit={handleSearch}
            >
                <input
                    type="search"
                    value={characterName}
                    onChange={(event) =>
                        setCharacterName(event.target.value)
                    }
                    placeholder="캐릭터 이름을 입력하세요"
                    aria-label="캐릭터 이름 검색"
                />

                <button
                    type="submit"
                    className="header-search-button"
                    aria-label="캐릭터 검색"
                >
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle
                            cx="11"
                            cy="11"
                            r="6.5"
                        />
                        <path d="m16 16 4 4" />
                    </svg>
                </button>
            </form>

            <div className="header-right">
                <button
                    type="button"
                    className="header-icon-button"
                    onClick={() =>
                        setIsDarkMode((previous) => !previous)
                    }
                    aria-label={
                        isDarkMode
                            ? "라이트 모드로 변경"
                            : "다크 모드로 변경"
                    }
                    aria-pressed={isDarkMode}
                >
                    {isDarkMode ? (
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="4"
                            />
                            <path d="M12 2v2" />
                            <path d="M12 20v2" />
                            <path d="m4.93 4.93 1.42 1.42" />
                            <path d="m17.65 17.65 1.42 1.42" />
                            <path d="M2 12h2" />
                            <path d="M20 12h2" />
                            <path d="m4.93 19.07 1.42-1.42" />
                            <path d="m17.65 6.35 1.42-1.42" />
                        </svg>
                    ) : (
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4a8.5 8.5 0 1 0 11.2 11.2Z" />
                        </svg>
                    )}
                </button>

                <button
                    type="button"
                    className="login-button"
                    onClick={handleLoginClick}
                >
                    로그인
                </button>
            </div>
        </header>
    );
}