import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    folderMenuItems,
    quickMenuItems,
} from "./MenuItems";
import "./AppMenu.css";

export default function AppMenu({ isOpen, onClose }) {
    const navigate = useNavigate();

    const [selectedFolder, setSelectedFolder] = useState(null);

    const handleMenuClick = (item) => {
        if (item.type === "folder") {
            setSelectedFolder(item);
            return;
        }

        setSelectedFolder(null);
        onClose();
        navigate(item.path);
    };

    const handleBack = () => {
        setSelectedFolder(null);
    };

    const handleClose = () => {
        setSelectedFolder(null);
        onClose();
    };

    // 메뉴가 닫히면 열려 있던 폴더도 초기화
    useEffect(() => {
        if (!isOpen) {
            setSelectedFolder(null);
        }
    }, [isOpen]);

    // Esc 키로 메뉴 닫기
    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                handleClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const renderIcon = (item) => {
        const isImage =
            typeof item.icon === "string" &&
            item.icon.startsWith("/");

        return (
            <span
                className={`app-menu-icon ${
                    item.type === "folder"
                        ? "app-menu-icon--folder"
                        : ""
                }`}
                style={{
                    "--app-color":
                        item.color ??
                        selectedFolder?.color ??
                        "#5b8def",
                }}
                aria-hidden="true"
            >
                {isImage ? (
                    <img src={item.icon} alt="" />
                ) : (
                    item.icon
                )}
            </span>
        );
    };

    const renderMenuItem = (item) => (
        <button
            key={item.id}
            type="button"
            className={`app-menu-item ${
                item.type === "folder"
                    ? "app-menu-item--folder"
                    : ""
            }`}
            onClick={() => handleMenuClick(item)}
        >
            {renderIcon(item)}

            <span className="app-menu-label">
                {item.label}
            </span>
        </button>
    );

    return (
        <div
            className={`app-menu ${
                isOpen ? "app-menu--open" : ""
            }`}
            aria-hidden={!isOpen}
        >
            <button
                type="button"
                className="app-menu-backdrop"
                aria-label="메뉴 닫기"
                onClick={handleClose}
                tabIndex={isOpen ? 0 : -1}
            />

            <section
                className="app-menu-panel"
                aria-label={
                    selectedFolder
                        ? `${selectedFolder.label} 폴더`
                        : "전체 메뉴"
                }
            >
                <div
                    className="app-menu-handle"
                    aria-hidden="true"
                />

                <header className="app-menu-header">
                    {selectedFolder && (
                        <button
                            type="button"
                            className="app-menu-back-button"
                            onClick={handleBack}
                        >
                            <span aria-hidden="true">←</span>
                            뒤로
                        </button>
                    )}

                    <h2 className="app-menu-title">
                        {selectedFolder
                            ? selectedFolder.label
                            : "전체 메뉴"}
                    </h2>

                    <button
                        type="button"
                        className="app-menu-close-button"
                        aria-label="메뉴 닫기"
                        onClick={handleClose}
                    >
                        ×
                    </button>
                </header>

                <div className="app-menu-content">
                    {selectedFolder ? (
                        <div className="app-menu-grid">
                            {selectedFolder.children.map(
                                renderMenuItem
                            )}
                        </div>
                    ) : (
                        <>
                            <section className="app-menu-section">
                                <h3 className="app-menu-section-title">
                                    바로가기
                                </h3>

                                <div className="app-menu-grid app-menu-grid--quick">
                                    {quickMenuItems.map(
                                        renderMenuItem
                                    )}
                                </div>
                            </section>

                            <section className="app-menu-section">
                                <h3 className="app-menu-section-title">
                                    전체 기능
                                </h3>

                                <div className="app-menu-grid">
                                    {folderMenuItems.map(
                                        renderMenuItem
                                    )}
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}