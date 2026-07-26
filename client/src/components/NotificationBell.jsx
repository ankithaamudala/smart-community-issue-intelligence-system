import { Link } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

const formatTime = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(date));

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <details className="notification-wrapper">
      <summary className="notification-summary">
        Alerts
        {unreadCount > 0 ? <span className="notification-count">{unreadCount}</span> : null}
      </summary>

      <div className="notification-dropdown">
        <div className="notification-dropdown-header">
          <strong>Notifications</strong>
          {unreadCount ? (
            <button type="button" className="text-btn" onClick={markAllAsRead}>
              Mark all read
            </button>
          ) : null}
        </div>

        {notifications.length === 0 ? (
          <p className="muted">No notifications yet.</p>
        ) : (
          <ul className="notification-list">
            {notifications.slice(0, 8).map((item) => (
              <li key={item._id}>
                <button
                  type="button"
                  className={`notification-item ${item.isRead ? "read" : "unread"}`}
                  onClick={() => {
                    if (!item.isRead) {
                      markAsRead(item._id);
                    }
                  }}
                >
                  <span>{item.message}</span>
                  <small>{formatTime(item.createdAt)}</small>
                </button>
              </li>
            ))}
          </ul>
        )}

        <Link to="/notifications" className="btn btn-ghost full-width">
          View All
        </Link>
      </div>
    </details>
  );
};

export default NotificationBell;

