import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { Link, useSearchParams } from 'react-router-dom';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Hook untuk membaca URL query (contoh: ?q=java&loc=jakarta)
  const [searchParams] = useSearchParams(); 

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true); // Set loading true setiap kali fetch
      try {
        // Ambil nilai keyword dan lokasi dari URL
        const keyword = searchParams.get('q') || '';
        const location = searchParams.get('loc') || '';

        // Siapkan parameter untuk dikirim ke Backend
        const query = new URLSearchParams();
        // Asumsi backend Anda menerima parameter 'title' untuk pencarian judul
        // dan 'location' untuk lokasi. Sesuaikan jika backend beda nama param.
        if (keyword) query.append('title', keyword); 
        if (location) query.append('location', location);

        // Gabungkan endpoint
        // Hasilnya jadi: /jobs?title=programmer&location=jakarta
        const endpoint = `/jobs?${query.toString()}`;
        
        console.log("Fetching data dari:", endpoint); // Cek console untuk debug

        const data = await apiFetch(endpoint);
        
        // Logika untuk menangani berbagai format respon API
        if (Array.isArray(data)) {
            setJobs(data);
        } else if (data.jobs && Array.isArray(data.jobs)) {
            setJobs(data.jobs);
        } else if (data.data && Array.isArray(data.data)) {
            setJobs(data.data);
        } else {
            console.warn("Format data tidak dikenali:", data);
            setJobs([]);
        }

      } catch (error) {
        console.error("Gagal mengambil data jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams]); // Efek dijalankan ulang jika parameter URL berubah

  if (loading) {
    return <div className="text-center mt-20 text-blue-600 font-semibold">Sedang memuat lowongan...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tampilkan pesan jika sedang mencari sesuatu */}
      {searchParams.get('q') && (
        <div className="mb-6">
          <h2 className="text-xl text-gray-700">
            Menampilkan hasil untuk: <span className="font-bold text-black">"{searchParams.get('q')}"</span>
            {searchParams.get('loc') && <span> di <span className="font-bold text-black">"{searchParams.get('loc')}"</span></span>}
          </h2>
          <Link to="/jobs" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
            &larr; Lihat semua lowongan
          </Link>
        </div>
      )}

      {/* Tampilan Grid Lowongan */}
      {!Array.isArray(jobs) || jobs.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-lg font-medium">Tidak ada lowongan yang ditemukan.</p>
          <p className="text-gray-400 text-sm mt-2">Coba kata kunci lain atau cek ejaan Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 line-clamp-1" title={job.title}>
                    {job.title}
                  </h2>
                  <p className="text-gray-600 font-medium text-sm mt-1">{job.company_name}</p>
                </div>
                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap ml-2">
                  {job.type || 'Full Time'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                   <span>📍</span> 
                   <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                   <span>💰</span> 
                   <span>Rp {job.salary ? job.salary.toLocaleString('id-ID') : 'Negosiasi'}</span>
                </div>
              </div>

              <Link 
                to={`/jobs/${job.id}`}
                className="block w-full text-center bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Lihat Detail
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;