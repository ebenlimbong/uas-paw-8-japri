import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states
  const [filters, setFilters] = useState({
    keyword: searchParams.get('q') || '',
    location: searchParams.get('loc') || '',
    type: searchParams.get('type') || '',
    salaryMin: searchParams.get('salaryMin') || '',
    salaryMax: searchParams.get('salaryMax') || '',
  });

  const jobTypes = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'];

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const keyword = searchParams.get('q') || '';
      const location = searchParams.get('loc') || '';
      const type = searchParams.get('type') || '';
      const salaryMin = searchParams.get('salaryMin') || '';
      const salaryMax = searchParams.get('salaryMax') || '';

      const query = new URLSearchParams();
      if (keyword) query.append('title', keyword);
      if (location) query.append('location', location);
      if (type) query.append('type', type);
      if (salaryMin) query.append('salary_min', salaryMin);
      if (salaryMax) query.append('salary_max', salaryMax);

      const endpoint = `/api/jobs?${query.toString()}`;
      const data = await apiFetch(endpoint);
      
      if (Array.isArray(data)) {
        setJobs(data);
      } else if (data.jobs && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      } else if (data.data && Array.isArray(data.data)) {
        setJobs(data.data);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.keyword) params.set('q', filters.keyword);
    if (filters.location) params.set('loc', filters.location);
    if (filters.type) params.set('type', filters.type);
    if (filters.salaryMin) params.set('salaryMin', filters.salaryMin);
    if (filters.salaryMax) params.set('salaryMax', filters.salaryMax);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ keyword: '', location: '', type: '', salaryMin: '', salaryMax: '' });
    setSearchParams({});
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">🔍 Filter Lowongan</h2>
              
              <form onSubmit={applyFilters} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kata Kunci
                  </label>
                  <input
                    type="text"
                    name="keyword"
                    value={filters.keyword}
                    onChange={handleFilterChange}
                    placeholder="Judul, skill, perusahaan..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Kota atau wilayah..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipe Pekerjaan
                  </label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none text-sm"
                  >
                    <option value="">Semua Tipe</option>
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Range Gaji (Rp)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="salaryMin"
                      value={filters.salaryMin}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="w-1/2 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none text-sm"
                    />
                    <input
                      type="number"
                      name="salaryMax"
                      value={filters.salaryMax}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="w-1/2 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition text-sm"
                  >
                    Terapkan Filter
                  </button>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition text-sm"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </aside>

          {/* Job Listings */}
          <main className="flex-1">
            {/* Active Filters */}
            {(searchParams.get('q') || searchParams.get('loc') || searchParams.get('type')) && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-gray-500 text-sm">Filter aktif:</span>
                {searchParams.get('q') && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    "{searchParams.get('q')}"
                  </span>
                )}
                {searchParams.get('loc') && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    📍 {searchParams.get('loc')}
                  </span>
                )}
                {searchParams.get('type') && (
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                    💼 {searchParams.get('type')}
                  </span>
                )}
                <button onClick={clearFilters} className="text-red-500 hover:underline text-sm ml-2">
                  Hapus filter
                </button>
              </div>
            )}

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Memuat lowongan...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Tidak Ada Lowongan Ditemukan</h2>
                <p className="text-gray-600">Coba ubah filter pencarian Anda</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-4">{jobs.length} lowongan ditemukan</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <div 
                      key={job.id} 
                      className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition duration-200"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-lg font-bold text-gray-900 line-clamp-1" title={job.title}>
                            {job.title}
                          </h2>
                          <p className="text-blue-600 font-medium text-sm mt-1">{job.company_name}</p>
                        </div>
                        <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md font-medium whitespace-nowrap ml-2">
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
                        className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200"
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Jobs;