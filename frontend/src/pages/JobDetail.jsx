import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { applyToJob, saveJob } from '../api/applications';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isSeeker } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      const data = await apiFetch(`/api/jobs/${id}`);
      setJob(data.data || data);
    } catch (error) {
      console.error("Job not found", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }

    if (!isSeeker) {
      setMessage({ type: 'error', text: 'Hanya Job Seeker yang bisa melamar pekerjaan' });
      return;
    }

    setApplying(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await applyToJob(id);
      if (result.success || result.id) {
        setApplied(true);
        setMessage({ type: 'success', text: 'Lamaran berhasil dikirim!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal mengirim lamaran' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Anda sudah melamar pekerjaan ini sebelumnya' });
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }

    if (!isSeeker) {
      setMessage({ type: 'error', text: 'Hanya Job Seeker yang bisa menyimpan pekerjaan' });
      return;
    }

    setSaving(true);
    try {
      const result = await saveJob(id);
      if (result.success || result.id) {
        setSaved(true);
        setMessage({ type: 'success', text: 'Lowongan berhasil disimpan!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal menyimpan' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Lowongan sudah disimpan sebelumnya' });
    } finally {
      setSaving(false);
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

  if (!job) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pekerjaan Tidak Ditemukan</h1>
          <Link to="/jobs" className="text-blue-600 hover:underline mt-4">
            ← Kembali ke Daftar Lowongan
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 px-4">
        {/* Back Button */}
        <Link to="/jobs" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
          ← Kembali ke Daftar Lowongan
        </Link>

        {/* Job Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Cover */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32 md:h-40"></div>
          
          <div className="px-6 md:px-8 pb-8">
            {/* Title Section */}
            <div className="relative -top-8 mb-2">
              <div className="bg-white p-5 rounded-xl shadow-md inline-block border border-gray-100">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{job.title}</h1>
                <p className="text-blue-600 font-semibold text-lg mt-1">{job.company_name || 'Perusahaan'}</p>
              </div>
            </div>

            {/* Message */}
            {message.text && (
              <div className={`mb-6 px-4 py-3 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-600' 
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}>
                {message.text}
              </div>
            )}

            {/* Job Meta */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                📍 {job.location}
              </span>
              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                💰 Rp {job.salary?.toLocaleString('id-ID') || 'Negosiasi'}
              </span>
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                💼 {job.type || 'Full Time'}
              </span>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Deskripsi Pekerjaan</h2>
              <div className="prose text-gray-700 whitespace-pre-line leading-relaxed">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            <div className="border-t border-gray-200 pt-6 mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">✅ Persyaratan</h2>
              <div className="prose text-gray-700 whitespace-pre-line leading-relaxed">
                {job.requirements}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 pt-6 mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleApply}
                disabled={applying || applied}
                className={`flex-1 font-bold py-3 px-8 rounded-lg shadow-lg transition duration-200 ${
                  applied 
                    ? 'bg-green-500 text-white cursor-default' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:-translate-y-0.5'
                } disabled:opacity-70`}
              >
                {applying ? 'Mengirim...' : applied ? '✅ Sudah Dilamar' : '📤 Lamar Sekarang'}
              </button>
              
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className={`flex-1 font-bold py-3 px-8 rounded-lg transition duration-200 ${
                  saved 
                    ? 'bg-pink-500 text-white cursor-default' 
                    : 'bg-white border-2 border-pink-500 text-pink-500 hover:bg-pink-50'
                } disabled:opacity-70`}
              >
                {saving ? 'Menyimpan...' : saved ? '❤️ Tersimpan' : '🔖 Simpan Lowongan'}
              </button>
            </div>

            {!isAuthenticated && (
              <p className="text-center text-gray-500 text-sm mt-4">
                <Link to="/login" className="text-blue-600 hover:underline">Login</Link> untuk melamar atau menyimpan lowongan
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetail;