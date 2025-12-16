import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCompanyProfile, updateCompanyProfile } from '../../api/profile';
import Layout from '../../components/Layout';

const CompanyProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    company_name: '',
    description: '',
    website: '',
    location: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    description: '',
    website: '',
    location: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getCompanyProfile();
      if (data.data) {
        const profile = {
          company_name: data.data.company_name || '',
          description: data.data.description || '',
          website: data.data.website || '',
          location: data.data.location || '',
        };
        setProfileData(profile);
        setFormData(profile);
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage({ type: '', text: '' });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(profileData);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await updateCompanyProfile(formData);
      if (result.success) {
        setProfileData(formData);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Company profile berhasil disimpan!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal menyimpan profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan' });
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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-600 mt-2">
            {isEditing ? 'Edit informasi perusahaan Anda' : 'Informasi perusahaan Anda'}
          </p>
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

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Company Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                🏢
              </div>
              <div className="text-white">
                <h2 className="text-xl font-bold">
                  {profileData.company_name || 'Nama Perusahaan'}
                </h2>
                <p className="opacity-90">{user?.email}</p>
                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm mt-2">
                  Employer Account
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {isEditing ? (
              /* Edit Mode */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="company_name" className="block text-sm font-semibold text-gray-700 mb-2">
                    🏢 Nama Perusahaan
                  </label>
                  <input
                    id="company_name"
                    name="company_name"
                    type="text"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                    placeholder="Masukkan nama perusahaan"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                    📍 Lokasi
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                    placeholder="Contoh: Jakarta Selatan, Indonesia"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-2">
                    🌐 Website
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                    placeholder="https://www.perusahaan.com"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    📝 Deskripsi Perusahaan
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none resize-none"
                    placeholder="Ceritakan tentang perusahaan Anda..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Profile'}
                  </button>
                </div>
              </form>
            ) : (
              /* View Mode */
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">🏢 Nama Perusahaan</h3>
                    <p className="text-gray-900 font-medium">
                      {profileData.company_name || <span className="text-gray-400 italic">Belum diisi</span>}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">📍 Lokasi</h3>
                    <p className="text-gray-900 font-medium">
                      {profileData.location || <span className="text-gray-400 italic">Belum diisi</span>}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">🌐 Website</h3>
                  {profileData.website ? (
                    <a 
                      href={profileData.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {profileData.website}
                    </a>
                  ) : (
                    <p className="text-gray-400 italic">Belum diisi</p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">📝 Deskripsi Perusahaan</h3>
                  <p className="text-gray-900 whitespace-pre-line">
                    {profileData.description || <span className="text-gray-400 italic">Belum diisi</span>}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">📧 Email</h3>
                  <p className="text-gray-900 font-medium">{user?.email}</p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleEdit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                  >
                    ✏️ Edit Company Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyProfile;
