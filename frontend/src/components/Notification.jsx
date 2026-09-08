import "../styles/Notification/Notification.css";

export default function Notification({
    type,
    message,
    onConfirm,
    onCancel
}) {

    return (
        <div className={`notification-overlay ${type}`}>

            <div className="notification-box">

                <div className="notification-icon">

                    {type === "success" && "✅"}

                    {type === "error" && "❌"}

                    {type === "confirm" && "⚠️"}

                </div>


                <p>{message}</p>


                {type === "confirm" && (

                    <div className="notification-actions">

                        <button
                            type="button"
                            className="notification-cancel"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>


                        <button
                            type="button"
                            className="notification-confirm"
                            onClick={onConfirm}
                        >
                            Delete
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
}