import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { publicFetch } from '../api/public';
// ✅ STEP 2: Menggunakan apiFetch agar token auth terkirim saat cek status
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ✅ STEP 1: Gunakan state baru sesuai instruksi
  const [isApplied, setIsApplied] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);

  // ======================
  // Fetch Job Detail & Status (Sinkronisasi Backend)
  // ======================
  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        // 1. Ambil data detail pekerjaan
        const res = await apiFetch(`/jobs/${id}`);
        const jobData = res.data || res;
        setJob(jobData);

        // 2. ✅ LOGIKA BARU: Jika user login, cek status lamaran dari daftar personal
        if (isAuthenticated) {
          // Memanggil endpoint applications/me sesuai data di backend
          const appRes = await apiFetch("/applications/me"); 
          
          if (appRes.success && Array.isArray(appRes.data)) {
            // Cek apakah ada application yang memiliki job.id yang sama dengan ID halaman ini
            const hasApplied = appRes.data.some(app => app.job.id === parseInt(id));
            setIsApplied(hasApplied);
          }
        }
      } catch (error) {
        console.error("Gagal sinkronisasi data pekerjaan atau status:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetail();
  }, [id, isAuthenticated]); // ✅ Tambahkan isAuthenticated agar trigger saat user login

  // ======================
  // Handle Apply Job
  // ======================
  const handleApply = async () => {
    // 1. Belum login → redirect
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // 2. Employer tidak boleh apply
    if (user.role !== "seeker") {
      setApplyError("Hanya job seeker yang dapat melamar pekerjaan.");
      return;
    }

    // 3. Kirim apply ke backend
    try {
      // ✅ STEP 3: Update handleApply sesuai instruksi
      setApplyLoading(true);
      setApplyError("");

      const res = await apiFetch(`/jobs/${id}/apply`, {
        method: "POST",
        body: JSON.stringify({}),
      });

      if (res.success) {
        // ✅ STEP 3: Sync dengan backend
        setIsApplied(true); 
      } else {
        setApplyError(res.error || "Gagal melamar pekerjaan.");
      }
    } catch (err) {
      setApplyError("Terjadi kesalahan saat mengirim lamaran.");
    } finally {
      setApplyLoading(false);
    }
  };

  // ======================
  // UI States
  // ======================
  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!job) return <div className="text-center py-10">Pekerjaan tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* Tombol Kembali */}
      <div className="max-w-4xl mx-auto mb-4">
        <Link to="/jobs" className="text-blue-600 hover:underline font-medium">
          &larr; Kembali ke Daftar Pekerjaan
        </Link>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header Cover */}
        <div className="bg-blue-600 h-32 md:h-48 w-full relative"></div>

        <div className="px-8 pb-8">
          {/* Title Section */}
          <div className="relative -top-10 mb-5">
            <div className="bg-white p-4 rounded-lg shadow-sm inline-block border">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {job.title}
              </h1>
              <p className="text-blue-600 font-medium text-lg">
                {job.company_name}
              </p>
            </div>
          </div>

          {/* Job Meta */}
          <div className="flex flex-wrap gap-4 mt-8 mb-8 text-sm text-gray-600">
            <span className="bg-gray-100 px-3 py-1 rounded-full">📍 {job.location}</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
              💰 Rp {job.salary?.toLocaleString('id-ID')}
            </span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              💼 {job.type}
            </span>
          </div>

          {/* Content */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Deskripsi Pekerjaan</h2>
            <div className="prose text-gray-700 whitespace-pre-line text-sm leading-relaxed">
              {job.description}
            </div>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-800">Persyaratan</h2>
            <div className="prose text-gray-700 whitespace-pre-line text-sm leading-relaxed">
              {job.requirements}
            </div>
          </div>

          {/* ✅ STEP 5: Tampilkan error sesuai instruksi */}
          {applyError && (
            <div className="mt-6 bg-red-50 text-red-700 px-4 py-3 rounded-lg border border-red-100 text-sm font-medium">
              ⚠️ {applyError}
            </div>
          )}

          {/* Action Button Section */}
          <div className="mt-10 border-t pt-6 flex justify-end">
            {/* ✅ STEP 4: Render tombol berdasarkan status isApplied */}
            <button
              onClick={handleApply}
              disabled={isApplied || applyLoading}
              className={`font-bold py-3 px-10 rounded-lg shadow-lg transition duration-200
                ${
                  isApplied
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 text-white"
                }
              `}
            >
              {isApplied
                ? "Sudah Melamar ✓"
                : applyLoading
                ? "Mengirim Lamaran..."
                : "Lamar Sekarang"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;