import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { Link } from 'react-router-dom';

const Jobs = () => {
  // Inisialisasi state sebagai Array kosong []
  const [jobs, setJobs] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await apiFetch('/jobs');
        
        // --- LOGGING UNTUK DEBUGGING (Cek Console Browser) ---
        console.log("Data dari Backend:", data);

        // --- PENGECEKAN FORMAT DATA (Agar tidak error .map) ---
        if (Array.isArray(data)) {
            // Kasus 1: Backend langsung mengirim Array [...]
            setJobs(data);
        } else if (data.jobs && Array.isArray(data.jobs)) {
            // Kasus 2: Backend mengirim Object { jobs: [...] }
            setJobs(data.jobs);
        } else if (data.data && Array.isArray(data.data)) {
            // Kasus 3: Backend mengirim Object { data: [...] }
            setJobs(data.data);
        } else {
            // Kasus 4: Format tidak dikenali, set ke array kosong biar gak crash
            console.error("Format data tidak dikenali/bukan array", data);
            setJobs([]);
        }

      } catch (error) {
        console.error("Gagal mengambil data jobs:", error);
        setJobs([]); // Pastikan tetap array jika error
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Memuat lowongan pekerjaan...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Lowongan Terbaru</h1>
      
      {/* Tambahan validasi: Pastikan jobs benar-benar Array sebelum di-map */}
      {!Array.isArray(jobs) || jobs.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">Belum ada lowongan tersedia saat ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{job.title}</h2>
                  <p className="text-gray-600 font-medium">{job.company_name}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
                  {job.type || 'Full Time'}
                </span>
              </div>
              
              <div className="mt-4 text-sm text-gray-500 space-y-1">
                <p>📍 {job.location}</p>
                <p>💰 Rp {job.salary ? job.salary.toLocaleString('id-ID') : '0'}</p>
              </div>

              <div className="mt-6">
                <Link 
                  to={`/jobs/${job.id}`}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;