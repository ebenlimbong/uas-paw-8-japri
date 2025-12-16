import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [showError, setShowError] = useState(false);
  
  const navigate = useNavigate();

  // Logic Validasi: Minimal Keyword atau Location harus diisi
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!keyword.trim() && !location.trim()) {
      setShowError(true);
      return;
    }

    // Navigasi dengan membawa semua parameter
    // Format URL: /jobs?q=...&loc=...&type=...&sal=...
    const params = new URLSearchParams();
    if(keyword) params.append('q', keyword);
    if(location) params.append('loc', location);
    if(jobType) params.append('type', jobType);
    if(salaryRange) params.append('sal', salaryRange);

    navigate(`/jobs?${params.toString()}`);
  };

  // Helper untuk menghilangkan error saat mengetik
  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    if (showError) setShowError(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Navbar Simple */}
      <nav className="flex justify-between items-center p-4 border-b border-gray-200">
        <span className="text-blue-700 text-3xl font-bold tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
            jobportal
        </span>
        <div className="hidden md:flex gap-4 text-sm font-medium text-gray-700">
             <a href="/login" className="text-blue-700 font-bold">Sign in</a>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="grow flex flex-col items-center pt-16 px-4">
        
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your next job starts here</h1>
        </div>

        {/* Alert Error */}
        {showError && (
            <div className="flex items-center gap-3 bg-[#fceceb] text-[#2d2d2d] px-6 py-4 rounded-xl mb-6 shadow-sm border border-red-100 animate-bounce-short">
                <span className="font-bold text-gray-800">Please enter a job title or location</span>
            </div>
        )}

        {/* FORM PENCARIAN UTAMA */}
        <form 
          onSubmit={handleSearch}
          className={`
            bg-white p-3 rounded-lg shadow-lg border flex flex-col gap-3 w-full max-w-4xl transition-colors duration-200
            ${showError ? 'border-red-500' : 'border-gray-300'} 
          `}
        >
          {/* Baris 1: Input Teks (What & Where) */}
          <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center border border-gray-300 rounded px-2 py-2">
                <span className="text-gray-400 font-bold ml-2">🔍</span>
                <input 
                    type="text" 
                    placeholder="Job title, keywords, or company"
                    className="outline-none text-gray-700 w-full ml-3"
                    value={keyword}
                    onChange={handleChange(setKeyword)} 
                />
              </div>

              <div className="flex-1 flex items-center border border-gray-300 rounded px-2 py-2">
                <span className="text-gray-400 font-bold ml-2">📍</span>
                <input 
                    type="text" 
                    placeholder="City, state, or zip code"
                    className="outline-none text-gray-700 w-full ml-3"
                    value={location}
                    onChange={handleChange(setLocation)}
                />
              </div>
          </div>

          {/* Baris 2: Dropdowns & Tombol */}
          <div className="flex flex-col md:flex-row gap-2">
              
              {/* Dropdown Job Type */}
              <select 
                value={jobType} 
                onChange={(e) => setJobType(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-gray-700 outline-none bg-white cursor-pointer"
              >
                  <option value="">Any Job Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Intern">Intern</option>
                  <option value="Remote">Remote</option>
              </select>

              {/* Dropdown Salary */}
              <select 
                value={salaryRange} 
                onChange={(e) => setSalaryRange(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-gray-700 outline-none bg-white cursor-pointer"
              >
                  <option value="">Any Salary</option>
                  <option value="0-5000000">&lt; Rp 5 Juta</option>
                  <option value="5000000-10000000">Rp 5 Juta - 10 Juta</option>
                  <option value="10000000-20000000">Rp 10 Juta - 20 Juta</option>
                  <option value="20000000-999999999">&gt; Rp 20 Juta</option>
              </select>

              <button 
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-8 rounded-md transition duration-200 md:w-auto w-full"
              >
                Find jobs
              </button>
          </div>
        </form>

      </main>
    </div>
  );
};

export default Home;