import { useState, useEffect } from "react";
import { apiFetch } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skills: "",
    experience: "",
    cv_url: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await apiFetch("/api/profile/me");
      if (res.success) {
        const { name, email, profile } = res.data;
        setFormData({
          name: name || "",
          email: email || "",
          skills: profile.skills || "",
          experience: profile.experience || "",
          cv_url: profile.cv_url || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await apiFetch("/api/profile/me", {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (res.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({ type: "error", text: res.error || "Failed to update profile." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      {/* Header Banner */}
      <div className="bg-blue-600 text-white py-12 px-6 text-center">
        <h1 className="text-3xl font-bold">Manage Your Profile</h1>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4">
          <ul className="bg-white rounded-lg shadow overflow-hidden">
            {[
              { id: "personal", label: "Personal Details" },
              { id: "skills", label: "Skills" },
              { id: "experience", label: "Work Experience" },
              { id: "cv", label: "Upload CV/Portfolio" },
              { id: "settings", label: "Account Settings", disabled: true },
            ].map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className={`w-full text-left px-6 py-4 border-b border-gray-100 transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600 font-semibold border-l-4 border-l-blue-600"
                      : tab.disabled
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content Area */}
        <main className="w-full md:w-3/4">
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">
              {activeTab === "personal" && "Personal Details"}
              {activeTab === "skills" && "Skills"}
              {activeTab === "experience" && "Work Experience"}
              {activeTab === "cv" && "CV / Portfolio"}
            </h2>

            {message.text && (
              <div
                className={`p-4 mb-6 rounded ${
                  message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                  </div>
                </div>
              )}

              {activeTab === "skills" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                  <textarea
                    name="skills"
                    rows="6"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="List your skills (e.g. Python, React, Data Analysis)..."
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  ></textarea>
                </div>
              )}

              {activeTab === "experience" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Experience</label>
                  <textarea
                    name="experience"
                    rows="8"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Describe your work experience..."
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  ></textarea>
                </div>
              )}

              {activeTab === "cv" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CV / Portfolio URL</label>
                  <input
                    type="text"
                    name="cv_url"
                    value={formData.cv_url}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourname"
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Enter a link to your CV, LinkedIn, or Portfolio.
                  </p>
                </div>
              )}

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
