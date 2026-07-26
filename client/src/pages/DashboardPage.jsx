import { useEffect, useMemo, useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { Link } from "react-router-dom";
import api from "../api/axios";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [issuesByCategory, setIssuesByCategory] = useState([]);
  const [highPriorityIssues, setHighPriorityIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/analytics");
        setStats(data.stats);
        setIssuesByCategory(data.issuesByCategory || []);
        setHighPriorityIssues(data.highPriorityIssues || []);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const categoryChartData = useMemo(
    () => ({
      labels: ["Issues by Category"],
      datasets: issuesByCategory.map((item, index) => ({
        label: item.category,
        data: [item.count],
        backgroundColor: ["#0f766e", "#f59e0b", "#2563eb", "#dc2626", "#16a34a"][index],
        borderRadius: 4
      }))
    }),
    [issuesByCategory]
  );

  const statusChartData = useMemo(
    () => ({
      labels: ["Pending", "In Progress", "Resolved"],
      datasets: [
        {
          label: "Issues by Status",
          data: stats ? [stats.pendingIssues, stats.inProgressIssues, stats.resolvedIssues] : [0, 0, 0],
          backgroundColor: ["#f97316", "#0ea5e9", "#22c55e"]
        }
      ]
    }),
    [stats]
  );

  if (loading) return <div className="panel">Loading dashboard...</div>;
  if (error) return <p className="error-text">{error}</p>;
  if (!stats) return <div className="panel">No analytics available.</div>;

  return (
    <section>
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <p>Track issue volume, resolution progress, and high-priority community concerns.</p>
      </div>

      <div className="stat-grid">
        <article className="panel stat-card">
          <h3>Total Issues</h3>
          <p>{stats.totalIssues}</p>
        </article>
        <article className="panel stat-card">
          <h3>Pending Issues</h3>
          <p>{stats.pendingIssues}</p>
        </article>
        <article className="panel stat-card">
          <h3>In Progress</h3>
          <p>{stats.inProgressIssues}</p>
        </article>
        <article className="panel stat-card">
          <h3>Resolved Issues</h3>
          <p>{stats.resolvedIssues}</p>
        </article>
      </div>

      <div className="chart-grid">
        <article className="panel chart-card">
          <h2>Issues by Category</h2>
          <Bar 
            data={categoryChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  position: "top"
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }}
          />
        </article>
        <article className="panel chart-card">
          <h2>Status Breakdown</h2>
          <Pie data={statusChartData} />
        </article>
      </div>

      <article className="panel">
        <h2>High Priority Issues</h2>
        {highPriorityIssues.length === 0 ? <p className="muted">No high-priority issues found.</p> : null}
        <ul className="priority-list">
          {highPriorityIssues.map((issue) => (
            <li key={issue._id}>
              <Link to={`/issues/${issue._id}`}>{issue.title}</Link>
              <span>Priority: {issue.priorityScore}</span>
              <span>Status: {issue.status}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
};

export default DashboardPage;

