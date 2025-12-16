import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import Layout from '../../components/Layout';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    type: 'Full Time',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const jobTypes = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        salary: parseInt(formData.salary) || 0,
      };

      const result = await apiFetch('/api/jobs', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (result.success || result.id) {
        navigate('/employer/dashboard');
      } else {
        setError(result.error || 'Gagal memposting lowongan');
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Posting Lowongan Baru</h1>
          <p className="text-gray-600 mt-2">Isi detail lowongan untuk menarik kandidat terbaik</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Judul Pekerjaan *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                placeholder="Contoh: Frontend Developer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                  Lokasi *
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                  placeholder="Contoh: Jakarta Selatan"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipe Pekerjaan *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                >
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="salary" className="block text-sm font-semibold text-gray-700 mb-2">
                Gaji (Rp/bulan) *
              </label>
              <input
                id="salary"
                name="salary"
                type="number"
                required
                value={formData.salary}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                placeholder="Contoh: 10000000"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi Pekerjaan *
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none resize-none"
                placeholder="Jelaskan tanggung jawab dan tugas..."
              />
            </div>

            <div>
              <label htmlFor="requirements" className="block text-sm font-semibold text-gray-700 mb-2">
                Persyaratan *
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows={5}
                required
                value={formData.requirements}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none resize-none"
                placeholder="Kualifikasi yang dibutuhkan..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/employer/dashboard')}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Memposting...' : 'Posting Lowongan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PostJob;
