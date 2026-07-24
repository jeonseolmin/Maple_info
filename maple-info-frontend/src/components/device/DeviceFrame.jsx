import "./DeviceFrame.css";

export default function DeviceFrame({ children }) {
    return (
        <div className="device-stage">
            <section className="tablet-device">
                <span className="tablet-camera" aria-hidden="true" />

                <span
                    className="tablet-button tablet-button--volume-up"
                    aria-hidden="true"
                />
                <span
                    className="tablet-button tablet-button--volume-down"
                    aria-hidden="true"
                />
                <span
                    className="tablet-button tablet-button--power"
                    aria-hidden="true"
                />

                <div className="tablet-screen">
                    {children}
                </div>
            </section>
        </div>
    );
}