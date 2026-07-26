import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);
      const { data } = await api.post("/auth/signup", form);
      login(data);
      navigate("/");
    } catch (signupError) {
      setError(signupError.response?.data?.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <form className="panel auth-card" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <p className="muted">Join your neighbors to improve community services faster.</p>

        <label>
          Name
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            minLength={6}
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
        </label>

        <label>
          Location
          <input
            type="text"
            value={form.location}
            onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
            required
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
};

export default SignupPage;

