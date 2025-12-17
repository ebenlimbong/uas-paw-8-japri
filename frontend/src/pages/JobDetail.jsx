import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Hapus useNavigate
import { publicFetch } from '../api/public';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const res = await publicFetch(`/jobs/${id}`);
        setJob(res.data || res); 
      } catch (error) {
        console.error("Job not found", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetail();
  }, [id]);

  const handleApply = () => {
    // Karena belum ada login, kita tampilkan alert biasa saja
    alert("Tombol Apply diklik! (Fitur ini butuh Login nanti)");
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!job) return <div className="text-center py-10">Pekerjaan tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* Tombol Kembali */}
      <div className="max-w-4xl mx-auto mb-4">
        <Link to="/" className="text-blue-600 hover:underline">
          &larr; Kembali ke Daftar Pekerjaan
        </Link>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Cover */}
        <div className="bg-blue-600 h-32 md:h-48 w-full relative"></div>
        
        <div className="px-8 pb-8">
          {/* Title Section */}
          <div className="relative -top-10 mb-5">
             <div className="bg-white p-4 rounded-lg shadow-sm inline-block border">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{job.title}</h1>
                <p className="text-blue-600 font-medium text-lg">{job.company_name}</p>
             </div>
          </div>

          {/* Job Meta */}
          <div className="flex flex-wrap gap-4 mt-8 mb-8 text-sm text-gray-600">
             <span className="bg-gray-100 px-3 py-1 rounded-full">
               📍 {job.location}
             </span>
             <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
               💰 Rp {job.salary?.toLocaleString('id-ID')}
             </span>
             <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
               💼 {job.type}
             </span>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold mb-4">Deskripsi Pekerjaan</h2>
            <div className="prose text-gray-700 whitespace-pre-line">
              {job.description}
            </div>

            <h2 className="text-xl font-bold mt-8 mb-4">Persyaratan</h2>
            <div className="prose text-gray-700 whitespace-pre-line">
              {job.requirements}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-10 border-t pt-6 flex justify-end">
            <button
              onClick={handleApply}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:-translate-y-1 transition duration-200"
            >
              Lamar Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;