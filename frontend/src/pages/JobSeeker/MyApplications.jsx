import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications } from '../../api/applications';
import Layout from '../../components/Layout';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getMyApplications();
      if (data.data && Array.isArray(data.data)) {
        setApplications(data.data);
      } else if (Array.isArray(data)) {
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'shortlisted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '⏳ Menunggu Review';
      case 'shortlisted':
        return '✅ Shortlisted';
      case 'rejected':
        return '❌ Ditolak';
      default:
        return status;
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
          <h1 className="text-3xl font-bold text-gray-900">Lamaran Saya</h1>
          <p className="text-gray-600 mt-2">Pantau status lamaran pekerjaan Anda</p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Lamaran</h2>
            <p className="text-gray-600 mb-6">Anda belum melamar pekerjaan apapun</p>
            <Link 
              to="/jobs" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Cari Lowongan
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div 
                key={app.id} 
                className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {app.job?.title || 'Posisi tidak tersedia'}
                    </h3>
                    <p className="text-blue-600 font-medium">
                      {app.job?.company_name || 'Perusahaan'}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                      <span>📍 {app.job?.location || '-'}</span>
                      <span>💰 Rp {app.job?.salary?.toLocaleString('id-ID') || 'Negosiasi'}</span>
                      <span>📅 Dilamar: {app.applied_date || '-'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(app.status)}`}>
                      {getStatusLabel(app.status)}
                    </span>
                    <Link 
                      to={`/jobs/${app.job_id || app.job?.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Lihat Detail →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyApplications;
