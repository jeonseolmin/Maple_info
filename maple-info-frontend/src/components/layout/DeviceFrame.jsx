import "./DeviceFrame.css";

export default function DeviceFrame({ children }) {
    return (
        <div className="device-stage">
            <div className="device-frame">
                <span className="device-camera" aria-hidden="true" />

                <div className="device-screen">
                    {children}
                </div>
            </div>
        </div>
    );
}