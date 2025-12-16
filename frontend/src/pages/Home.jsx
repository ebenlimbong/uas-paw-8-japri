import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Mengarahkan ke halaman Jobs dengan membawa query parameter
    // Contoh: /jobs?q=developer&loc=jakarta
    navigate(`/jobs?q=${keyword}&loc=${location}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* --- NAVBAR SEDERHANA --- */}
      <nav className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          {/* Logo ala Indeed */}
          <span className="text-blue-700 text-3xl font-bold tracking-tighter">
            jobportal
          </span>
          <div className="hidden md:flex gap-4 text-sm font-medium text-gray-700">
            <a href="#" className="hover:underline">Home</a>
            <a href="#" className="hover:underline">Company reviews</a>
            <a href="#" className="hover:underline">Find salaries</a>
          </div>
        </div>
        <div className="flex gap-4 text-sm font-medium text-blue-700">
          <a href="/login" className="hover:underline">Sign in</a>
          <span className="text-gray-300">|</span>
          <a href="/register" className="hover:underline">Employers / Post Job</a>
        </div>
      </nav>

      {/* --- CONTENT UTAMA (SEARCH) --- */}
      <main className="grow flex flex-col items-center pt-16 px-4">
        
        {/* Pesan Sapaan (Optional) */}
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your next job starts here</h1>
            <p className="text-gray-500">Find the job that fits your life</p>
        </div>

        {/* --- FORM PENCARIAN --- */}
        <form 
          onSubmit={handleSearch}
          className="bg-white p-3 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-300 flex flex-col md:flex-row gap-2 w-full max-w-4xl"
        >
          {/* Input: Job Title */}
          <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-gray-300 px-2">
            <span className="text-gray-400 font-bold ml-2">🔍</span>
            <div className="flex flex-col w-full ml-3">
               <label className="text-xs font-bold text-gray-700">What</label>
               <input 
                 type="text" 
                 placeholder="Job title, keywords, or company"
                 className="outline-none text-gray-700 placeholder-gray-400 w-full py-1"
                 value={keyword}
                 onChange={(e) => setKeyword(e.target.value)}
               />
            </div>
          </div>

          {/* Input: Location */}
          <div className="flex-1 flex items-center px-2">
            <span className="text-gray-400 font-bold ml-2">📍</span>
            <div className="flex flex-col w-full ml-3">
               <label className="text-xs font-bold text-gray-700">Where</label>
               <input 
                 type="text" 
                 placeholder="City, state, or zip code"
                 className="outline-none text-gray-700 placeholder-gray-400 w-full py-1"
                 value={location}
                 onChange={(e) => setLocation(e.target.value)}
               />
            </div>
          </div>

          {/* Button Search */}
          <button 
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-md transition duration-200"
          >
            Find jobs
          </button>
        </form>

        {/* --- LINK POST CV --- */}
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            <span className="text-blue-700 font-bold cursor-pointer hover:underline">Post your CV</span> 
            - It only takes a few seconds
          </p>
        </div>

        {/* Trending Section (Statis dulu) */}
        <div className="mt-16 text-center">
           <p className="text-sm text-gray-500 cursor-pointer flex items-center gap-1 justify-center">
             What's trending on JobPortal <span className="text-xs">▼</span>
           </p>
        </div>
      </main>

      {/* FOOTER SIMPLE */}
      <footer className="py-6 px-4 border-t border-gray-200 text-xs text-gray-500 flex flex-wrap gap-4 justify-center md:justify-start">
         <a href="#" className="hover:underline">Browse Jobs</a>
         <a href="#" className="hover:underline">Browse Companies</a>
         <a href="#" className="hover:underline">Salaries</a>
         <a href="#" className="hover:underline">About</a>
         <a href="#" className="hover:underline">Help Center</a>
         <span className="ml-auto">© 2025 JobPortal</span>
      </footer>
    </div>
  );
};

export default Home;