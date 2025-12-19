import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../api/client";
// ✅ Import Navbar
import Navbar from "../../components/Navbar";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/saved_jobs/me"); // Menggunakan route sesuai backend

      if (res.success) {
        setSavedJobs(res.data);
      } else {
        setError(res.error || "Gagal memuat saved jobs.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleUnsave = async (savedId) => {
    try {
      const res = await apiFetch(/saved-jobs/${savedId}, {
        method: "DELETE",
      });

      if (res.success) {
        // Optimistic update agar UI langsung berubah
        setSavedJobs((prev) =>
          prev.filter((job) => job.id !== savedId)
        );
      }
    } catch (err) {
      alert("Gagal menghapus saved job.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }