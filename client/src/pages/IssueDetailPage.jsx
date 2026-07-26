import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import MapDisplay from "../components/MapDisplay";
import { useAuth } from "../context/AuthContext";

const STATUSES = ["Pending", "In Progress", "Resolved"];

const formatDate = (isoDate) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(isoDate));

const IssueDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [statusDraft, setStatusDraft] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const imageUrl = useMemo(() => {
    if (!issue?.image) return "";
    const base = import.meta.env.VITE_ASSET_URL || "http://localhost:5000";
    return `${base}${issue.image}`;
  }, [issue?.image]);

  const fetchIssue = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/issues/${id}`);
      setIssue(data.issue);
      setComments(data.comments || []);
      setStatusDraft(data.issue.status);
      setError("");
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || "Unable to load issue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const handleUpvote = async () => {
    try {
      setActionError("");
      const { data } = await api.post(`/issues/${id}/upvote`);
      setIssue(data.issue);
    } catch (upvoteError) {
      setActionError(upvoteError.response?.data?.message || "Failed to upvote issue.");
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;

    try {
      setActionError("");
      const { data } = await api.post(`/issues/${id}/comment`, { text: commentText.trim() });
      setComments((prev) => [data.comment, ...prev]);
      setIssue(data.issue);
      setCommentText("");
    } catch (commentError) {
      setActionError(commentError.response?.data?.message || "Failed to post comment.");
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setActionError("");
      const { data } = await api.patch(`/issues/${id}/status`, { status: statusDraft });
      setIssue(data.issue);
    } catch (statusError) {
      setActionError(statusError.response?.data?.message || "Failed to update status.");
    }
  };

  if (loading) return <div className="panel">Loading issue details...</div>;
  if (error) return <p className="error-text">{error}</p>;
  if (!issue) return <div className="panel">Issue not found.</div>;

  return (
    <section className="issue-detail-layout">
      <article className="panel">
        <div className="issue-card-header">
          <span className={`pill category-${issue.category.toLowerCase()}`}>{issue.category}</span>
          <span className={`pill status-${issue.status.toLowerCase().replace(/\s+/g, "-")}`}>
            {issue.status}
          </span>
        </div>
        <h1>{issue.title}</h1>
        <p>{issue.description}</p>

        {imageUrl ? <img className="detail-image" src={imageUrl} alt={issue.title} /> : null}

        <MapDisplay latitude={issue.latitude} longitude={issue.longitude} title={issue.title} />

        <div className="issue-meta">
          <span>Coordinates: ({issue.latitude?.toFixed(4)}, {issue.longitude?.toFixed(4)})</span>
          <span>Priority: {issue.priorityScore}</span>
          <span>Upvotes: {issue.upvoteCount}</span>
          <span>Comments: {issue.commentCount}</span>
        </div>

        <p className="muted">
          Reported by {issue.reportedBy?.name || "Unknown"} on {formatDate(issue.createdAt)}
        </p>

        {isAuthenticated ? (
          <div className="inline-actions">
            <button type="button" className="btn" onClick={handleUpvote}>
              Upvote
            </button>
            <select value={statusDraft} onChange={(event) => setStatusDraft(event.target.value)}>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button type="button" className="btn btn-secondary" onClick={handleStatusUpdate}>
              Update Status
            </button>
          </div>
        ) : (
          <p className="muted">
            <Link to="/login">Login</Link> to upvote, comment, or update status.
          </p>
        )}

        {actionError ? <p className="error-text">{actionError}</p> : null}
      </article>

      <section className="panel">
        <h2>Comments</h2>

        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              rows={3}
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Add your comment..."
            />
            <button type="submit" className="btn">
              Post Comment
            </button>
          </form>
        ) : null}

        <div className="comment-list">
          {comments.length === 0 ? <p className="muted">No comments yet.</p> : null}
          {comments.map((comment) => (
            <article key={comment._id} className="comment-item">
              <div className="comment-item-header">
                <strong>{comment.userId?.name || "Community Member"}</strong>
                <small>{formatDate(comment.createdAt)}</small>
              </div>
              <p>{comment.text}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};

export default IssueDetailPage;

