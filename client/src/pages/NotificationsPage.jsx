import { Link } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

const formatDate = (isoDate) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(isoDate));

const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <section>
      <div className="page-header">
        <h1>Notifications</h1>
        <p>{unreadCount} unread alerts</p>
      </div>

      <div className="panel">
        {notifications.length ? (
          <button type="button" className="btn btn-secondary" onClick={markAllAsRead}>
            Mark all as read
          </button>
        ) : null}

        <ul className="notification-page-list">
          {notifications.length === 0 ? <li className="muted">No notifications yet.</li> : null}

          {notifications.map((item) => (
            <li key={item._id} className={item.isRead ? "read" : "unread"}>
              <div>
                <p>{item.message}</p>
                <small>{formatDate(item.createdAt)}</small>
              </div>
              <div className="inline-actions">
                {item.issueId?._id ? (
                  <Link to={`/issues/${item.issueId._id}`} className="btn btn-ghost">
                    Open Issue
                  </Link>
                ) : null}
                {!item.isRead ? (
                  <button type="button" className="btn btn-secondary" onClick={() => markAsRead(item._id)}>
                    Mark Read
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default NotificationsPage;

