import "./LoadingIcon.css";

export default function LoadingIcon({
                                        text = "불러오는 중...",
                                        fullScreen = false,
                                    }) {
    return (
        <div
            className={`loading-container ${
                fullScreen ? "loading-container--fullscreen" : ""
            }`}
            role="status"
            aria-live="polite"
        >
            <div className="loading-icon" aria-hidden="true">
                <span className="loading-icon__base" />
                <span className="loading-icon__fill" />
            </div>

            {text && <p className="loading-text">{text}</p>}
        </div>
    );
}