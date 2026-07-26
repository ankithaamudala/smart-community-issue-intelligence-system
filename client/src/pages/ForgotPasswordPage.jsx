import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/auth/forgot-password", { email: email.trim() });
      setSuccess(data.message || "Password reset link sent to your email.");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to process request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <form className="panel auth-card" onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>
        <p className="muted">Enter your email address and we'll send you a link to reset your password.</p>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="muted">
          Remember your password? <Link to="/login">Back to Login</Link>
        </p>
      </form>
    </section>
  );
};

export default ForgotPasswordPage;
