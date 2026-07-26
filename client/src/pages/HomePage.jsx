import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import IssueCard from "../components/IssueCard";

const CATEGORIES = ["All", "Infrastructure", "Sanitation", "Utilities", "Safety", "Community"];
const STATUSES = ["All", "Pending", "In Progress", "Resolved"];

const HomePage = () => {
  const [issues, setIssues] = useState([]);
  const [filters, setFilters] = useState({
    category: "All",
    status: "All",
    search: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const params = {};
        if (filters.category !== "All") params.category = filters.category;
        if (filters.status !== "All") params.status = filters.status;
        if (filters.search.trim()) params.search = filters.search.trim();

        const { data } = await api.get("/issues", { params });
        setIssues(data.issues || []);
        setError("");
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Failed to load issues.");
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [filters]);

  const headerText = useMemo(() => {
    if (!issues.length) return "No matching issues found.";
    return `${issues.length} issues ranked by intelligent priority score`;
  }, [issues.length]);

  return (
    <section>
      <div className="page-header">
        <h1>Community Issue Feed</h1>
        <p>{headerText}</p>
      </div>

      <div className="panel filter-panel">
        <input
          type="text"
          placeholder="Search by title, keyword, or location"
          value={filters.search}
          onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
        />

        <select
          value={filters.category}
          onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      {loading ? <div className="panel">Loading issues...</div> : null}

      {!loading && !issues.length ? <div className="panel">No issues found for your filters.</div> : null}

      <div className="issue-grid">
        {issues.map((issue) => (
          <IssueCard key={issue._id} issue={issue} />
        ))}
      </div>
    </section>
  );
};

export default HomePage;

