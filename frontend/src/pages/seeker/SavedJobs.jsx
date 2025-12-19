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
      const res = await apiFetch(`/saved-jobs/${savedId}`, {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Saved Jobs
            </h1>
            <p className="text-gray-500 mt-1">
              Daftar pekerjaan yang telah Anda simpan untuk dilamar nanti.
            </p>
          </div>
          
          <button
            onClick={fetchSavedJobs}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-100 text-red-700 px-5 py-4 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Jobs Grid */}
        {savedJobs.length === 0 ? (
          <div className="text-center bg-white border border-gray-100 rounded-2xl py-24 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3-7 3V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800">Belum ada pekerjaan disimpan</h3>
            <p className="text-gray-500 mt-2 mb-6">Mulai cari pekerjaan dan simpan yang paling menarik bagi Anda.</p>
            <Link
              to="/jobs"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
            >
              Cari Pekerjaan Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {savedJobs.map((item) => (
              <div
                key={item.id}
                className="group border border-gray-100 rounded-2xl p-6 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {item.job.title}
                    </h3>
                    <p className="text-blue-600 font-semibold text-sm mt-0.5">
                      {item.job.company_name || "Company"}
                    </p>
                  </div>
                  
                  {/* Delete Button - Styled as an Icon */}
                  <button
                    onClick={() => handleUnsave(item.id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Hapus dari simpanan"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 13H5v-2h14v2z" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-3 mb-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📍</span> {item.job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">💼</span> {item.job.type}
                  </div>
                  <div className="flex items-center gap-2 font-bold text-gray-900">
                    <span className="text-gray-400 font-normal italic">💰 Rp</span> 
                    {item.job.salary?.toLocaleString("id-ID")}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                  <Link
                    to={`/jobs/${item.job.id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-blue-600 text-sm font-bold rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all"
                  >
                    Lihat Detail Pekerjaan
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedJobs;