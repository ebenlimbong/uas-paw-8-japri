import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';

const Home = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  
  const [salary, setSalary] = useState('');

  const navigate = useNavigate();
  const { user } = useAuth();

  // Salary
  const salaryOptions = [
    { label: '1 - 5 jt', min: 1000000, max: 5000000 },
    { label: '6 - 10 jt', min: 6000000, max: 10000000 },
    { label: '15 - 20 jt', min: 15000000, max: 20000000 },
    { label: '> 20 jt', min: 20000000, max: '' },
  ];

  const relatedSearches = ['UI design', 'Web design', 'Graphic designer', 'User interface'];

  // ✅ PERUBAHAN: Logika handleSearch untuk mengirim min_salary & max_salary
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append('q', keyword);
    if (location) params.append('loc', location);
    
    if (salary) {
      const selected = salaryOptions.find(s => s.label === salary);
      if (selected?.min) params.append('min_salary', selected.min);
      if (selected?.max) params.append('max_salary', selected.max);
    }
    
    navigate(`/jobs?${params.toString()}`);
  };

  const handleQuickSearch = (term) => {
    navigate(`/jobs?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - Blue Gradient */}
      <section className="bg-gradient-to-r from-blue-500 via-blue-500 to-blue-600 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Let's find your dream job!
          </h1>

          {/* Search Form - Capsule Style */}
          <form onSubmit={handleSearch} className="bg-white rounded-xl p-2 flex flex-col md:flex-row items-stretch gap-2 shadow-lg">
            {/* Job Title Input */}
            <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Find job title"
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            {/* Location Input */}
            <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="text"
                placeholder="Country/ City"
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 md:w-52 relative">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <select
                className="w-full bg-transparent outline-none text-gray-700 text-sm cursor-pointer appearance-none"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              >
                <option value="">Salary range</option>
                {salaryOptions.map(option => (
                  <option key={option.label} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
              <svg className="w-4 h-4 text-gray-400 shrink-0 absolute right-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Search
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </form>

          {/* Related Searches */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-blue-100 text-sm">Related:</span>
            {relatedSearches.map((term) => (
              <button
                key={term}
                onClick={() => handleQuickSearch(term)}
                className="text-white text-sm hover:underline transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Start your job search here</h2>
          <p className="text-gray-500 mb-8">Browse thousands of job opportunities and find your perfect match</p>
          <button
            onClick={() => navigate('/jobs')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Browse All Jobs
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;