import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../api/client";
import Navbar from "../../components/Navbar";

export default function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================
  // FETCH JOBS (EMPLOYER ONLY)
  // =====================
  const fetchJobs = async () => {
    setLoading(true);
    try {
      // 🔥 FIX UTAMA: pakai endpoint khusus employer
      const res = await apiFetch("/employer/jobs");

      if (res.success) {
        setJobs(res.data);
      }
    } catch (err) {
      console.error("Gagal load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // DELETE JOB
  // =====================
  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus job ini?"
    );
    if (!confirmDelete) return;

    try {
      const res = await apiFetch(`/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (res.success) {
        fetchJobs(); // refresh list
      } else {
        alert(res.error || "Gagal menghapus job");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus job");
    }
  };

  // =====================
  // INIT
  // =====================
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Manage Jobs</h1>

          <Link
            to="/employer/jobs/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold"
          >
            + Post Job
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : jobs.length === 0 ? (
          <div className="bg-gray-50 border rounded-lg p-6 text-center text-gray-500">
            Belum ada job yang diposting.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="border rounded-xl p-5 bg-white shadow-sm"
              >
                <h3 className="font-semibold text-lg">
                  {job.title}
                </h3>

                <p className="text-sm text-gray-500">
                  📍 {job.location}
                </p>

                <p className="text-sm text-gray-500">
                  💼 {job.type}
                </p>

                <div className="flex gap-4 mt-4 text-sm font-medium">
                  <Link
                    to={`/employer/jobs/${job.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>

                  <Link
                    to={`/employer/jobs/${job.id}/applications`}
                    className="text-green-600 hover:underline"
                  >
                    Applicants
                  </Link>

                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}