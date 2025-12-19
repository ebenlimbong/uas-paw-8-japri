import { useEffect, useState } from "react";
import { apiFetch } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";

export default function SeekerProfile() {
  const { setUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [cvUrl, setCvUrl] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiFetch("/profile/me");

        if (!res.success) {
          throw new Error(res.error);
        }

        const data = res.data;

        setName(data.name || "");
        setEmail(data.email || "");
        setSkills(data.profile?.skills || "");
        setExperience(data.profile?.experience || "");
        setCvUrl(data.profile?.cv_url || "");
      } catch (err) {
        setError("Gagal memuat data profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await apiFetch("/profile/me", {
        method: "PUT",
        body: JSON.stringify({
          name,
          skills,
          experience,
          cv_url: cvUrl,
        }),
      });

      if (!res.success) {
        throw new Error(res.error || "Update gagal");
      }

      // 🔥 UPDATE CONTEXT USER
      setUser(res.data);

      setSuccess("Profil berhasil diperbarui.");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        {error && (
          <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="bg-white border rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              value={email}
              disabled
              className="w-full border rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Skills</label>
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Experience</label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">CV URL</label>
            <input
              value={cvUrl}
              onChange={(e) => setCvUrl(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
