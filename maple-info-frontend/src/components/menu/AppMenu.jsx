// src/components/menu/AppMenu.jsx

import {
    useCallback,
    useEffect,
} from "react";

import { useNavigate } from "react-router-dom";

import {
    folderMenuItems,
    quickMenuItems,
} from "./MenuItems";

import "./AppMenu.css";
import mabletSilverIcon from "../../assets/icons/mablet-silver-icon.png";
export default function AppMenu({
                                    isOpen,
                                    onClose,
                                }) {
    const navigate = useNavigate();

    const closeMenu = useCallback(() => {
        onClose();
    }, [onClose]);

    const navigateTo = (path) => {
        if (!path) {
            return;
        }

        closeMenu();
        navigate(path);
    };

    /*
     * ESC 키로 메뉴 닫기
     */
    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [isOpen, closeMenu]);

    /*
     * 메뉴가 열려 있을 때
     * 바깥 페이지 스크롤 방지
     */
    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow =
                previousOverflow;
        };
    }, [isOpen]);

    const renderIcon = (
        item,
        additionalClassName = ""
    ) => {
        return (
            <span
                className={[
                    "app-menu-icon",
                    additionalClassName,
                ]
                    .filter(Boolean)
                    .join(" ")}
                aria-hidden="true"
            >
                <img
                    src={item.icon}
                    alt=""
                    draggable="false"
                />
            </span>
        );
    };

    /*
     * 바로가기 카드
     */
    const renderQuickMenuItem = (item) => {
        return (
            <button
                key={item.id}
                type="button"
                className="app-menu-quick-card"
                onClick={() =>
                    navigateTo(item.path)
                }
                aria-label={`${item.label} 페이지로 이동`}
            >
                {renderIcon(
                    item,
                    "app-menu-icon--quick"
                )}

                <span className="app-menu-quick-content">
                    <strong className="app-menu-card-label">
                        {item.label}
                    </strong>
                </span>
            </button>
        );
    };

    /*
     * 카테고리 내부 기능 버튼
     */
    const renderCategoryLink = (
        child,
        category
    ) => {
        return (
            <button
                key={child.id}
                type="button"
                className="app-menu-category-link"
                onClick={() =>
                    navigateTo(child.path)
                }
                title={`${category.label} - ${child.label}`}
            >
                <span
                    className="app-menu-category-link-dot"
                    aria-hidden="true"
                />

                <span className="app-menu-category-link-label">
                    {child.label}
                </span>

                <span
                    className="app-menu-category-link-arrow"
                    aria-hidden="true"
                >

                </span>
            </button>
        );
    };

    /*
     * 전체 기능 카테고리 카드
     */
    const renderCategoryCard = (category) => {
        return (
            <article
                key={category.id}
                className="app-menu-category-card"
            >
                <header className="app-menu-category-header">
                    {renderIcon(
                        category,
                        "app-menu-icon--category"
                    )}

                    <div className="app-menu-category-heading">
                        <strong className="app-menu-category-title">
                            {category.label}
                        </strong>

                        {category.description && (
                            <p className="app-menu-category-description">
                                {category.description}
                            </p>
                        )}
                    </div>

                </header>

                <div className="app-menu-category-links">
                    {category.children.map(
                        (child) =>
                            renderCategoryLink(
                                child,
                                category
                            )
                    )}
                </div>
            </article>
        );
    };

    return (
        <div
            className={[
                "app-menu",
                isOpen
                    ? "app-menu--open"
                    : "",
            ]
                .filter(Boolean)
                .join(" ")}
            aria-hidden={!isOpen}
        >
            <button
                type="button"
                className="app-menu-backdrop"
                aria-label="전체 메뉴 닫기"
                onClick={closeMenu}
                tabIndex={isOpen ? 0 : -1}
            />

            <section
                className="app-menu-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="app-menu-title"
            >
                <div
                    className="app-menu-handle"
                    aria-hidden="true"
                />

                <header className="app-menu-header">
                    <div className="app-menu-title-group">
                        <span className="app-menu-eyebrow">
                            MABLET MENU
                        </span>

                        <h2
                            id="app-menu-title"
                            className="app-menu-title"
                        >
                            전체 메뉴
                        </h2>

                        <p className="app-menu-subtitle">
                            필요한 기능을 한 번에 찾아보세요.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="app-menu-close-button"
                        aria-label="전체 메뉴 닫기"
                        onClick={closeMenu}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path d="M6 6l12 12" />
                            <path d="M18 6 6 18" />
                        </svg>
                    </button>
                </header>

                <div className="app-menu-content">
                    <section className="app-menu-section">
                        <div className="app-menu-section-header">
                            <div className="app-menu-section-heading">
                                <span className="app-menu-section-number">
                                    01
                                </span>

                                <h3 className="app-menu-section-title">
                                    바로가기
                                </h3>
                            </div>

                            <p className="app-menu-section-description">
                                자주 사용하는 기능
                            </p>
                        </div>

                        <div className="app-menu-quick-grid">
                            {quickMenuItems.map(
                                renderQuickMenuItem
                            )}
                        </div>
                    </section>

                    <section className="app-menu-section">
                        <div className="app-menu-section-header">
                            <div className="app-menu-section-heading">
                                <span className="app-menu-section-number">
                                    02
                                </span>

                                <h3 className="app-menu-section-title">
                                    전체 기능
                                </h3>
                            </div>

                            <p className="app-menu-section-description">
                                원하는 기능을 바로 선택하세요
                            </p>
                        </div>

                        <div className="app-menu-category-grid">
                            {folderMenuItems.map(
                                renderCategoryCard
                            )}
                        </div>
                    </section>
                </div>

                <footer className="app-menu-footer">
                    <img
                        className="app-menu-footer-logo"
                        src={mabletSilverIcon}
                        alt=""
                        aria-hidden="true"
                        draggable="false"
                    />
                    <span>MABLET</span>
                </footer>
            </section>
        </div>
    );
}