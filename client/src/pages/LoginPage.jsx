import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", { email, password });
      login(data);
      navigate("/");
    } catch (loginError) {
      setError(loginError.response?.data?.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <form className="panel auth-card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <p className="muted">Sign in to report issues, upvote, and engage in discussions.</p>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <div style={{ textAlign: "right", marginBottom: "1rem" }}>
          <Link to="/forgot-password" style={{ fontSize: "0.9rem" }}>
            Forgot Password?
          </Link>
        </div>

        {error ? <p className="error-text">{error}</p> : null}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="muted">
          No account? <Link to="/signup">Create one</Link>
        </p>
      </form>
    </section>
  );
};

export default LoginPage;

