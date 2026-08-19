// src/components/menu/AppMenu.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    folderMenuItems,
    quickMenuItems,
} from "./MenuItems";

import "./AppMenu.css";

export default function AppMenu({ isOpen, onClose }) {
    const navigate = useNavigate();

    const [selectedFolder, setSelectedFolder] =
        useState(null);

    const closeMenu = () => {
        setSelectedFolder(null);
        onClose();
    };

    const handleMenuClick = (item) => {
        if (item.type === "folder") {
            setSelectedFolder(item);
            return;
        }

        closeMenu();
        navigate(item.path);
    };

    const handleBack = () => {
        setSelectedFolder(null);
    };

    /*
     * 메뉴가 닫힐 때 선택한 폴더 초기화
     */
    useEffect(() => {
        if (!isOpen) {
            setSelectedFolder(null);
        }
    }, [isOpen]);

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
    }, [isOpen, onClose]);

    /*
     * 메뉴가 열려 있는 동안 배경 스크롤 방지
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

    const renderIcon = (item) => {
        return (
            <span
                className="app-menu-icon"
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

    const renderQuickMenuItem = (item) => {
        return (
            <button
                key={item.id}
                type="button"
                className="app-menu-quick-card"
                onClick={() =>
                    handleMenuClick(item)
                }
            >
                {renderIcon(item)}

                <span className="app-menu-card-text">
                    <strong className="app-menu-card-label">
                        {item.label}
                    </strong>


                </span>
            </button>
        );
    };

    const renderFolderMenuItem = (item) => {
        return (
            <button
                key={item.id}
                type="button"
                className="app-menu-feature-card"
                onClick={() =>
                    handleMenuClick(item)
                }
            >
                {renderIcon(item)}

                <span className="app-menu-feature-content">
                    <strong className="app-menu-card-label">
                        {item.label}
                    </strong>

                    {item.description && (
                        <span className="app-menu-description">
                            {item.description}
                        </span>
                    )}
                </span>


            </button>
        );
    };

    const renderChildMenuItem = (item) => {
        return (
            <button
                key={item.id}
                type="button"
                className="app-menu-child-card"
                onClick={() =>
                    handleMenuClick(item)
                }
            >
                {renderIcon(item)}

                <span className="app-menu-child-content">
                    <strong className="app-menu-card-label">
                        {item.label}
                    </strong>

                    <span className="app-menu-card-action">
                        페이지 열기
                    </span>
                </span>

            </button>
        );
    };

    return (
        <div
            className={[
                "app-menu",
                isOpen ? "app-menu--open" : "",
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
                    <div className="app-menu-heading">
                        {selectedFolder && (
                            <button
                                type="button"
                                className="app-menu-back-button"
                                onClick={handleBack}
                                aria-label="전체 메뉴로 돌아가기"
                            >
                                <span aria-hidden="true">
                                    ←
                                </span>

                                <span>전체 메뉴</span>
                            </button>
                        )}

                        <div className="app-menu-title-group">
                            <span className="app-menu-eyebrow">
                                MAPLIT MENU
                            </span>

                            <h2
                                id="app-menu-title"
                                className="app-menu-title"
                            >
                                {selectedFolder
                                    ? selectedFolder.label
                                    : "전체 메뉴"}
                            </h2>

                            <p className="app-menu-subtitle">
                                {selectedFolder
                                    ? selectedFolder.description
                                    : "필요한 기능을 빠르게 찾아보세요."}
                            </p>
                        </div>
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
                    {selectedFolder ? (
                        <section className="app-menu-section">
                            <div className="app-menu-section-header">
                                <div>
                                    <span className="app-menu-section-number">
                                        {String(
                                            selectedFolder
                                                .children
                                                .length
                                        ).padStart(2, "0")}
                                    </span>

                                    <h3 className="app-menu-section-title">
                                        {selectedFolder.label} 기능
                                    </h3>
                                </div>
                            </div>

                            <div className="app-menu-child-grid">
                                {selectedFolder.children.map(
                                    renderChildMenuItem
                                )}
                            </div>
                        </section>
                    ) : (
                        <>
                            <section className="app-menu-section">
                                <div className="app-menu-section-header">
                                    <div>
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
                                    <div>

                                        <h3 className="app-menu-section-title">
                                            전체 기능
                                        </h3>
                                    </div>

                                    <p className="app-menu-section-description">
                                        카테고리를 선택하세요
                                    </p>
                                </div>

                                <div className="app-menu-feature-grid">
                                    {folderMenuItems.map(
                                        renderFolderMenuItem
                                    )}
                                </div>
                            </section>
                        </>
                    )}
                </div>

                <footer className="app-menu-footer">
                    <span className="app-menu-footer-mark">
                        M
                    </span>

                    <span>MAPLIT</span>
                </footer>
            </section>
        </div>
    );
}