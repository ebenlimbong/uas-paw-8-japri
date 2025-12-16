import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSavedJobs, unsaveJob } from '../../api/applications';
import Layout from '../../components/Layout';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const data = await getSavedJobs();
      if (data.data && Array.isArray(data.data)) {
        setSavedJobs(data.data);
      } else if (Array.isArray(data)) {
        setSavedJobs(data);
      }
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (savedJobId) => {
    if (!window.confirm('Hapus dari daftar tersimpan?')) return;
    
    try {
      await unsaveJob(savedJobId);
      setSavedJobs(savedJobs.filter(job => job.id !== savedJobId));
    } catch (error) {
      console.error('Error unsaving job:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lowongan Tersimpan</h1>
          <p className="text-gray-600 mt-2">Lowongan yang Anda simpan untuk dilihat nanti</p>
        </div>

        {savedJobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔖</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Lowongan Tersimpan</h2>
            <p className="text-gray-600 mb-6">Simpan lowongan yang menarik untuk melamar nanti</p>
            <Link 
              to="/jobs" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Cari Lowongan
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedJobs.map((saved) => (
              <div 
                key={saved.id} 
                className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                      {saved.job?.title || 'Posisi'}
                    </h3>
                    <p className="text-blue-600 font-medium text-sm mt-1">
                      {saved.job?.company_name || 'Perusahaan'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleUnsave(saved.id)}
                    className="text-red-400 hover:text-red-600 p-2 transition"
                    title="Hapus dari tersimpan"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{saved.job?.location || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💰</span>
                    <span>Rp {saved.job?.salary?.toLocaleString('id-ID') || 'Negosiasi'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💼</span>
                    <span>{saved.job?.type || 'Full Time'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    Disimpan: {saved.saved_at || '-'}
                  </span>
                  <Link 
                    to={`/jobs/${saved.job?.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SavedJobs;
