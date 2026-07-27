import { useNavigate } from "react-router-dom";
import { menuItems } from "./menuItems";
import "./AppMenu.css";

export default function AppMenu({ isOpen, onClose }) {
    const navigate = useNavigate();

    const moveTo = (path) => {
        onClose();
        navigate(path);
    };

    return (
        <div
            className={`app-menu ${isOpen ? "app-menu--open" : ""}`}
            aria-hidden={!isOpen}
        >
            <button
                type="button"
                className="app-menu-backdrop"
                aria-label="메뉴 닫기"
                onClick={onClose}
            />

            <section className="app-menu-panel" aria-label="전체 메뉴">
                <div className="app-menu-handle" aria-hidden="true" />

                <div className="app-menu-grid">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            className="app-menu-item"
                            onClick={() => moveTo(item.path)}
                        >
                            <span
                                className="app-menu-icon"
                                style={{ "--app-color": item.color }}
                            >
                                {item.icon}
                            </span>

                            <span className="app-menu-label">
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}