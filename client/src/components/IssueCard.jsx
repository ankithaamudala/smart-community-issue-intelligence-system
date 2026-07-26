import { Link } from "react-router-dom";

const IssueCard = ({ issue }) => {
  const baseUrl = import.meta.env.VITE_ASSET_URL || "http://localhost:5000";

  return (
    <article className="issue-card">
      {issue.image ? (
        <img
          className="issue-card-image"
          src={`${baseUrl}${issue.image}`}
          alt={issue.title}
          loading="lazy"
        />
      ) : null}

      <div className="issue-card-content">
        <div className="issue-card-header">
          <span className={`pill category-${issue.category.toLowerCase()}`}>{issue.category}</span>
          <span className={`pill status-${issue.status.toLowerCase().replace(/\s+/g, "-")}`}>
            {issue.status}
          </span>
        </div>

        <h3>{issue.title}</h3>
        <p>{issue.description}</p>

        <div className="issue-meta">
          <span>Priority: {issue.priorityScore}</span>
          <span>Upvotes: {issue.upvoteCount}</span>
          <span>Comments: {issue.commentCount}</span>
        </div>

        <div className="issue-footer">
          <small>{issue.location}</small>
          <Link to={`/issues/${issue._id}`} className="btn btn-secondary">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default IssueCard;

