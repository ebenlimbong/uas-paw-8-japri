import { useEffect, useState } from 'react';
import { publicFetch } from '../api/public';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form states
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('loc') || '');
  
  const [salary, setSalary] = useState('');
  const [jobType, setJobType] = useState(searchParams.get('type') || '');
  const [sortBy, setSortBy] = useState('relevancy');

  const salaryOptions = [
    { label: '1 - 5 jt', min: 1000000, max: 5000000 },
    { label: '6 - 10 jt', min: 6000000, max: 10000000 },
    { label: '15 - 20 jt', min: 15000000, max: 20000000 },
    { label: '> 20 jt', min: 20000000, max: '' },
  ];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();

        if (searchParams.get('q')) query.append('q', searchParams.get('q'));
        if (searchParams.get('loc')) query.append('location', searchParams.get('loc'));
        if (searchParams.get('type')) query.append('type', searchParams.get('type'));

        if (searchParams.get('min_salary'))
          query.append('min_salary', searchParams.get('min_salary'));

        if (searchParams.get('max_salary'))
          query.append('max_salary', searchParams.get('max_salary'));

        const res = await publicFetch(`/jobs/search?${query.toString()}`);
        const jobList = res.success ? res.data : [];
        
        setJobs(jobList);
        if (jobList.length > 0) setSelectedJob(jobList[0]);
      } catch (err) {
        console.error(err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (keyword) params.append('q', keyword);
    if (location) params.append('loc', location);
    if (jobType) params.append('type', jobType);

    if (salary) {
      const selected = salaryOptions.find(s => s.label === salary);
      if (selected?.min) params.append('min_salary', selected.min);
      if (selected?.max) params.append('max_salary', selected.max);
    }

    navigate(`/jobs?${params.toString()}`);
  };

  const formatSalary = (salary) => {
    if (!salary) return '';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumSignificantDigits: 3 }).format(salary);
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-gradient-to-r from-blue-500 via-blue-500 to-blue-600 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Let's find your dream job!</h1>
          <form onSubmit={handleSearch} className="bg-white rounded-xl p-2 flex flex-col md:flex-row items-stretch gap-2 shadow-lg">
            <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input className="w-full bg-transparent outline-none text-gray-700 text-sm placeholder-gray-400" placeholder="Find job title" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            </div>
            <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <input className="w-full bg-transparent outline-none text-gray-700 text-sm placeholder-gray-400" placeholder="Country/ City" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 md:w-52">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <select 
                className="w-full bg-transparent outline-none text-gray-700 text-sm cursor-pointer" 
                value={salary} 
                onChange={(e) => setSalary(e.target.value)}
              >
                <option value="">Salary range</option>
                {salaryOptions.map(s => (
                  <option key={s.label} value={s.label}>{s.label}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              Search
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-blue-100 text-sm">Related:</span>
            {['UI design', 'Web design', 'Graphic designer', 'User interface'].map(t => (
              <button key={t} onClick={() => navigate(`/jobs?q=${t}`)} className="text-white text-sm hover:underline transition-colors">{t}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
        <aside className="w-56 shrink-0 hidden lg:block">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-800">Set filter</h3>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-600 mb-3">Sort by</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSortBy('relevancy')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all text-left ${sortBy === 'relevancy' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                >
                  Relevancy
                </button>
                <button
                  onClick={() => setSortBy('newest')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all text-left ${sortBy === 'newest' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                >
                  Newest
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-600 mb-3">Job type</h4>
              <div className="space-y-3">
                {['Full-time', 'Intern', 'Remote', 'Part-time'].map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="jobType"
                      value={type}
                      checked={jobType === type}
                      onChange={() => {
                        setJobType(type);
                        const params = new URLSearchParams(searchParams);
                        params.set('type', type);
                        navigate(`/jobs?${params.toString()}`);
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className={`text-sm transition-colors ${jobType === type ? 'text-blue-600 font-semibold' : 'text-gray-700 group-hover:text-blue-500'}`}>
                      {type}
                    </span>
                  </label>
                ))}
                {jobType && (
                  <button 
                    onClick={() => {
                      setJobType('');
                      const params = new URLSearchParams(searchParams);
                      params.delete('type');
                      navigate(`/jobs?${params.toString()}`);
                    }}
                    className="text-xs text-red-500 hover:underline mt-2"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-700 font-medium">{jobs.length} job results</p>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">No jobs found matching your criteria.</p>
              <button 
                onClick={() => navigate('/jobs')} 
                className="mt-4 text-blue-500 hover:underline text-sm"
              >
                View all jobs
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {currentJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`bg-white border rounded-xl p-5 cursor-pointer transition-all hover:shadow-md ${selectedJob?.id === job.id ? 'border-blue-500 ring-1 ring-blue-500 shadow-md' : 'border-gray-200'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {job.company_name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 line-clamp-1">{job.title}</h3>
                        <p className="text-xs text-gray-500">{job.company_name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-medium">{job.type}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">{formatSalary(job.salary)}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>

        <aside className="w-64 shrink-0 hidden xl:block">
        </aside>
      </div>
    </div>
  );
};

export default Jobs;