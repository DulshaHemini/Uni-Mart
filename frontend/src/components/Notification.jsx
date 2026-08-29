import "../styles/Notification/Notification.css";

export default function Notification({ type, message }) {
    return (
        <div className={`notification-overlay ${type}`}>
            <div className="notification-box">

                <div className="notification-icon">
                    {type === "success" ? "✅" : "❌"}
                </div>

                <p>{message}</p>

            </div>
        </div>
    );
}