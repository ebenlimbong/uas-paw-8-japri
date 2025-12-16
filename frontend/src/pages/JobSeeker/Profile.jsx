import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../api/profile';
import Layout from '../../components/Layout';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    skills: '',
    experience: '',
    cv_url: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    experience: '',
    cv_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      if (data.data) {
        const profile = {
          name: data.data.name || data.data.user?.name || user?.name || '',
          skills: data.data.skills || '',
          experience: data.data.experience || '',
          cv_url: data.data.cv_url || '',
        };
        setProfileData(profile);
        setFormData(profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
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
      const result = await updateProfile(formData);
      if (result.success) {
        setProfileData(formData);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile berhasil disimpan!' });
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
          <h1 className="text-3xl font-bold text-gray-900">Profile Saya</h1>
          <p className="text-gray-600 mt-2">
            {isEditing ? 'Edit informasi profile Anda' : 'Informasi profile Anda'}
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
          {/* User Info Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl shadow-lg">
                👤
              </div>
              <div className="text-white">
                <h2 className="text-xl font-bold">
                  {profileData.name || user?.email?.split('@')[0] || 'User'}
                </h2>
                <p className="opacity-90">{user?.email}</p>
                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm mt-2">
                  Job Seeker
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
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    👤 Nama Lengkap
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label htmlFor="skills" className="block text-sm font-semibold text-gray-700 mb-2">
                    🎯 Keahlian (Skills)
                  </label>
                  <textarea
                    id="skills"
                    name="skills"
                    rows={3}
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none resize-none"
                    placeholder="Contoh: JavaScript, React, Node.js, Python, SQL..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Pisahkan dengan koma untuk beberapa keahlian</p>
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-2">
                    💼 Pengalaman Kerja
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    rows={5}
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none resize-none"
                    placeholder="Jelaskan pengalaman kerja Anda..."
                  />
                </div>

                <div>
                  <label htmlFor="cv_url" className="block text-sm font-semibold text-gray-700 mb-2">
                    📄 Link CV / Resume
                  </label>
                  <input
                    id="cv_url"
                    name="cv_url"
                    type="url"
                    value={formData.cv_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                    placeholder="https://drive.google.com/... atau link lainnya"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload CV Anda ke Google Drive, Dropbox, dll dan paste linknya di sini</p>
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
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">👤 Nama Lengkap</h3>
                    <p className="text-gray-900 font-medium">
                      {profileData.name || <span className="text-gray-400 italic">Belum diisi</span>}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">📧 Email</h3>
                    <p className="text-gray-900 font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">🎯 Keahlian (Skills)</h3>
                  {profileData.skills ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profileData.skills.split(',').map((skill, index) => (
                        <span 
                          key={index} 
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">Belum diisi</p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">💼 Pengalaman Kerja</h3>
                  <p className="text-gray-900 whitespace-pre-line">
                    {profileData.experience || <span className="text-gray-400 italic">Belum diisi</span>}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">📄 Link CV / Resume</h3>
                  {profileData.cv_url ? (
                    <a 
                      href={profileData.cv_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {profileData.cv_url}
                    </a>
                  ) : (
                    <p className="text-gray-400 italic">Belum diisi</p>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleEdit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                  >
                    ✏️ Edit Profile
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

export default Profile;
