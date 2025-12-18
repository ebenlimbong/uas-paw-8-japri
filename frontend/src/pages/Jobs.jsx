import { useEffect, useState } from 'react';
import { publicFetch } from '../api/public';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

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
  const [experience, setExperience] = useState('');

  // Filter states
  const [sortBy, setSortBy] = useState('relevancy');
  const [jobType, setJobType] = useState('Full-time');
  const [salaryRange, setSalaryRange] = useState([150, 2500]);
  const [workMode, setWorkMode] = useState('Remote');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const queryBackend = new URLSearchParams();
        const qParam = searchParams.get('q');
        const locParam = searchParams.get('loc');
        const typeParam = searchParams.get('type');
        const salParam = searchParams.get('sal');

        if (qParam) queryBackend.append('q', qParam);
        if (locParam) queryBackend.append('location', locParam);
        if (typeParam) queryBackend.append('type', typeParam);

        if (salParam) {
          const [min, max] = salParam.split('-');
          if (min) queryBackend.append('min_salary', min);
          if (max) queryBackend.append('max_salary', max);
        }

        const endpoint = `/jobs/search?${queryBackend.toString()}`;
        const data = await publicFetch(endpoint);

        let jobList = [];
        if (data.success && Array.isArray(data.data)) jobList = data.data;

        setJobs(jobList);
        if (jobList.length > 0) setSelectedJob(jobList[0]);
        else setSelectedJob(null);
      } catch (error) {
        console.error("Error fetching jobs:", error);
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

  // Pagination
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
      {/* Navbar - Capsule Style */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">●</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Capsule</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/jobs" className="text-gray-800 font-medium hover:text-blue-600">Find Jobs</Link>
            <Link to="/companies" className="text-gray-500 font-medium hover:text-blue-600">Companies</Link>
            <Link to="/career-tips" className="text-gray-500 font-medium hover:text-blue-600">Career tips</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          {user ? (
            <Link to={user.role === 'seeker' ? '/seeker/profile' : '#'} className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
              <span className="text-white font-semibold text-sm">{user.name?.charAt(0) || 'U'}</span>
            </Link>
          ) : (
             <Link to="/login" className="text-blue-700 hover:text-blue-800 font-semibold transition-colors text-sm">
              Masuk
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Search - Blue Gradient */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Let's find your dream job!</h1>
          <form onSubmit={handleSearch} className="bg-white rounded-xl p-2 flex flex-col md:flex-row items-stretch gap-2 shadow-lg">
            <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input className="w-full bg-transparent outline-none text-gray-700 text-sm" placeholder="Find job title" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            </div>
            <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <input className="w-full bg-transparent outline-none text-gray-700 text-sm" placeholder="Country/ City" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 md:w-48">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <select className="w-full bg-transparent outline-none text-gray-500 text-sm cursor-pointer" value={experience} onChange={(e) => setExperience(e.target.value)}>
                <option value="">Level/ experience</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg flex items-center gap-2">
              Search
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-blue-100 text-sm">Related:</span>
            {['UI design', 'Web design', 'Graphic designer', 'User interface'].map(t => (
              <button key={t} onClick={() => navigate(`/jobs?q=${t}`)} className="text-white text-sm hover:underline">{t}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
        {/* Left Sidebar - Filters */}
        <aside className="w-56 shrink-0 hidden lg:block">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            {/* Set Filter Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-800">Set filter</h3>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
              </svg>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-600 mb-3">Sort by</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('relevancy')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${sortBy === 'relevancy' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                >
                  Relevancy
                </button>
                <button
                  onClick={() => setSortBy('newest')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${sortBy === 'newest' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                >
                  Newest
                </button>
              </div>
            </div>

            {/* Job Type */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-600 mb-3">Job type</h4>
              <div className="space-y-2">
                {['Full-time', 'Internship', 'Freelance', 'Volunteer'].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${jobType === type ? 'border-blue-500' : 'border-gray-300'}`}>
                      {jobType === type && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-600 mb-3">Salary</h4>
              <div className="text-sm text-gray-500 mb-2">${salaryRange[0]} - ${salaryRange[1]}</div>
              <div className="relative h-2 bg-gray-200 rounded-full">
                <div className="absolute h-2 bg-blue-500 rounded-full" style={{ left: '10%', right: '20%' }}></div>
                <div className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full -top-1" style={{ left: '10%' }}></div>
                <div className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full -top-1" style={{ left: '80%' }}></div>
              </div>
            </div>

            {/* On-site/Remote */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">On-site/remote</h4>
              <div className="space-y-2">
                {['Remote', 'On site', 'Hybrid'].map((mode) => (
                  <label key={mode} className="flex items-center gap-3 cursor-pointer">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${workMode === mode ? 'border-blue-500' : 'border-gray-300'}`}>
                      {workMode === mode && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                    <span className="text-sm text-gray-700">{mode}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Center - Job Cards */}
        <main className="flex-1">
          {/* Header with count and pagination */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-700 font-medium">{jobs.length} job results</p>
            <div className="flex items-center gap-1">
              <button className="p-1 text-gray-400 hover:text-gray-600" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              {[1, 2, 3, 4].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full text-sm font-medium ${currentPage === page ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {page}
                </button>
              ))}
              <button className="p-1 text-gray-400 hover:text-gray-600" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          {/* Job Cards Grid */}
          {jobs.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <p className="text-gray-500">No jobs found. Try a different search.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {currentJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`bg-white border rounded-xl p-5 cursor-pointer transition-all hover:shadow-md ${selectedJob?.id === job.id ? 'border-blue-500 shadow-md' : 'border-gray-200'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* Company Avatar */}
                      <div className="w-11 h-11 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        {job.company_name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{job.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /></svg>
                          {job.location || 'Jakarta'}
                        </div>
                      </div>
                    </div>
                    {/* Bookmark */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSaveJob(job.id); }}
                      className={`p-1.5 rounded-lg transition-colors ${savedJobs.includes(job.id) ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                      <svg className="w-5 h-5" fill={savedJobs.includes(job.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">{job.type || 'Full-time'}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">3+ years experience</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">{formatSalary(job.salary) || '$300'}/ month</span>
                  </div>

                  {/* Description preview */}
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {job.description || 'have a strong command of design software such as Adobe XD, Sketch, Figma, or similar tools commonly used in the industry...'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Right Sidebar - User Profile */}
        <aside className="w-64 shrink-0 hidden xl:block">
          {/* User Profile Card */}
          <Link to={user?.role === 'seeker' ? '/seeker/profile' : '#'} className="block bg-white border border-gray-200 rounded-xl p-5 mb-4 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full mx-auto mb-3 flex items-center justify-center">
              {user ? (
                <span className="text-white font-bold text-xl">{user.name?.charAt(0)}</span>
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <h3 className="font-semibold text-gray-800">{user?.name || 'Guest User'}</h3>
            <p className="text-sm text-gray-500">{user?.role === 'employer' ? 'Employer' : 'Job Seeker'}</p>
            <p className="text-xs text-blue-500 mt-1">4+ years</p>
          </Link>

          {/* Stats */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Search appear</p>
                <p className="font-bold text-gray-800">43x</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Applied Job</p>
                <p className="font-bold text-gray-800">56</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Recruiters Respond</p>
                <p className="font-bold text-gray-800">10</p>
              </div>
            </div>
          </div>

          {/* Guidance Card */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-gray-200 rounded-xl p-5">
            <h4 className="font-semibold text-gray-800 mb-1">Guidance for you</h4>
            <p className="text-xs text-gray-500 mb-3">based on your activity</p>
            <p className="text-sm text-gray-600 mb-4">Boost your career with expert-led courses on resume improvement and networking to land your next opportunity.</p>
            <div className="bg-blue-500 rounded-lg p-4 text-white">
              <p className="text-sm font-medium">Tips to improve your resume</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Jobs;