import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import MapPicker from "../components/MapPicker";

const CATEGORIES = ["Infrastructure", "Sanitation", "Utilities", "Safety", "Community", "Other"];

const ReportIssuePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: CATEGORIES[0],
    location: "",
    latitude: null,
    longitude: null
  });
  const [customCategory, setCustomCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setForm((prev) => ({ ...prev, category: selectedCategory }));
    if (selectedCategory !== "Other") {
      setCustomCategory("");
    }
  };

  const handleLocationSelect = (locationData) => {
    setForm((prev) => ({
      ...prev,
      latitude: locationData.latitude,
      longitude: locationData.longitude
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.title.trim() || !form.description.trim() || form.latitude === null || form.longitude === null) {
      setError("Title, description, and location (from map) are required.");
      return;
    }

    if (form.category === "Other" && !customCategory.trim()) {
      setError("Please specify a category when selecting 'Other'.");
      return;
    }

    try {
      setLoading(true);
      const payload = new FormData();
      payload.append("title", form.title.trim());
      payload.append("description", form.description.trim());
      const finalCategory = form.category === "Other" ? customCategory.trim() : form.category;
      payload.append("category", finalCategory);
      payload.append("latitude", form.latitude);
      payload.append("longitude", form.longitude);
      if (imageFile) payload.append("image", imageFile);

      const { data } = await api.post("/issues", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      navigate(`/issues/${data.issue._id}`);
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Could not create issue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="page-header">
        <h1>Report a Community Issue</h1>
        <p>Document the issue clearly so neighbors and authorities can act faster.</p>
      </div>

      <form className="panel form-grid" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            type="text"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            maxLength={140}
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            rows={5}
            maxLength={1500}
            required
          />
        </label>

        <label>
          Category
          <select
            value={form.category}
            onChange={handleCategoryChange}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        {form.category === "Other" && (
          <label>
            Please specify the category
            <input
              type="text"
              value={customCategory}
              onChange={(event) => setCustomCategory(event.target.value)}
              placeholder="Enter category name"
              maxLength={50}
              required
            />
          </label>
        )}

        <MapPicker onLocationSelect={handleLocationSelect} />

        {form.latitude && form.longitude && (
          <div style={{ padding: "1rem", backgroundColor: "#f0f8f0", borderRadius: "8px", marginBottom: "1rem" }}>
            <p style={{ margin: 0, fontSize: "0.95rem" }}>
              ✅ <strong>Location selected:</strong> Latitude: {form.latitude.toFixed(4)}, Longitude: {form.longitude.toFixed(4)}
            </p>
          </div>
        )}

        <label>
          Optional Image
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setImageFile(event.target.files?.[0] || null)}
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Issue"}
        </button>
      </form>
    </section>
  );
};

export default ReportIssuePage;

