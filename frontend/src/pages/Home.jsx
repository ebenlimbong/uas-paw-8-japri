import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Home = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const relatedSearches = ['UI design', 'Web design', 'Graphic designer', 'User interface'];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append('q', keyword);
    if (location) params.append('loc', location);
    if (experience) params.append('exp', experience);
    navigate(`/jobs?${params.toString()}`);
  };

  const handleQuickSearch = (term) => {
    navigate(`/jobs?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar - Capsule Style */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">●</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Capsule</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/jobs" className="text-gray-800 font-medium hover:text-blue-600 transition-colors">
              Find Jobs
            </Link>
            <Link to="/companies" className="text-gray-500 font-medium hover:text-blue-600 transition-colors">
              Companies
            </Link>
            <Link to="/career-tips" className="text-gray-500 font-medium hover:text-blue-600 transition-colors">
              Career tips
            </Link>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          {user ? (
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{user.name?.charAt(0) || 'U'}</span>
            </div>
          ) : (
            <Link to="/login" className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          )}
        </div>
      </nav>

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

            {/* Experience Dropdown */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 md:w-52">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <select
                className="w-full bg-transparent outline-none text-gray-700 text-sm cursor-pointer appearance-none"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="">Level/ experience</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level (3+ years)</option>
                <option value="senior">Senior Level (5+ years)</option>
              </select>
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Main Content would normally go here - for landing we show features */}
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