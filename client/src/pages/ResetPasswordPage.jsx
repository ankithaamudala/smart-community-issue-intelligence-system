import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !passwordConfirm) {
      setError("Both password fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/auth/reset-password", {
        token,
        password,
        passwordConfirm
      });
      setSuccess("Password reset successfully! Logging you in...");
      login(data);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <section className="auth-section">
        <div className="panel auth-card">
          <h1>Invalid Reset Link</h1>
          <p className="error-text">The password reset link is invalid or has expired.</p>
          <p className="muted">
            Please <a href="/forgot-password">request a new reset link</a>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-section">
      <form className="panel auth-card" onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
        <p className="muted">Enter your new password below.</p>

        <label>
          New Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            minLength={6}
            required
          />
        </label>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </section>
  );
};

export default ResetPasswordPage;
