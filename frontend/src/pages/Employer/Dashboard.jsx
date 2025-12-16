import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import Layout from '../../components/Layout';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, applications: 0 });

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const data = await apiFetch('/api/jobs?my_jobs=true');
      const jobList = data.data || data.jobs || data || [];
      setJobs(Array.isArray(jobList) ? jobList : []);
      
      // Calculate stats
      setStats({
        total: jobList.length,
        active: jobList.length,
        applications: jobList.reduce((acc, job) => acc + (job.application_count || 0), 0)
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Yakin ingin menghapus lowongan ini?')) return;
    
    try {
      await apiFetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Gagal menghapus lowongan');
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
      <div className="max-w-7xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Employer</h1>
            <p className="text-gray-600 mt-1">Kelola lowongan pekerjaan Anda</p>
          </div>
          <Link 
            to="/employer/post-job"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Posting Lowongan Baru
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="text-4xl font-bold">{stats.total}</div>
            <div className="text-blue-100 mt-1">Total Lowongan</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <div className="text-4xl font-bold">{stats.active}</div>
            <div className="text-green-100 mt-1">Lowongan Aktif</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="text-4xl font-bold">{stats.applications}</div>
            <div className="text-purple-100 mt-1">Total Pelamar</div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Daftar Lowongan</h2>
          </div>

          {jobs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Lowongan</h3>
              <p className="text-gray-600 mb-6">Mulai posting lowongan untuk menarik kandidat terbaik</p>
              <Link 
                to="/employer/post-job"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Posting Lowongan Pertama
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {jobs.map((job) => (
                <div key={job.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                        <span>📍 {job.location}</span>
                        <span>💰 Rp {job.salary?.toLocaleString('id-ID')}</span>
                        <span>💼 {job.type}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/employer/jobs/${job.id}/applicants`}
                        className="bg-green-50 hover:bg-green-100 text-green-600 px-4 py-2 rounded-lg font-medium text-sm transition"
                      >
                        👥 Lihat Pelamar
                      </Link>
                      <Link
                        to={`/employer/edit-job/${job.id}`}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium text-sm transition"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium text-sm transition"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
