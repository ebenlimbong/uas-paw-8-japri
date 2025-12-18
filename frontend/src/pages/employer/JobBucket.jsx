import React, { useEffect, useState } from 'react';
import { publicFetch } from '../../api/public';
import JobCard from '../../components/JobCard'

const JobBucket = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // Menggunakan endpoint config.add_route('api_jobs', '/api/jobs')
      const res = await publicFetch('/jobs');
      setJobs(res.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Logika Filter Sederhana di Frontend
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header & Search */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Temukan Pekerjaan Impianmu
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Ribuan lowongan kerja dari perusahaan terkemuka menanti Anda.
          </p>
          
          <div className="max-w-2xl mx-auto relative">
            <input 
              type="text" 
              placeholder="Cari posisi atau lokasi..." 
              className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 shadow-sm transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-6 h-6 text-gray-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        {/* Job Grid */}
        {loading ? (
          <p className="text-center text-gray-500">Memuat lowongan...</p>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">Tidak ada lowongan yang ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobBucket;