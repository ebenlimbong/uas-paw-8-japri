import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import halaman yang SUDAH Anda buat atau AKAN Anda buat
import Jobs from './pages/Jobs';        // Halaman List Pekerjaan
import JobDetail from './pages/JobDetail'; // Halaman Detail (Nanti kita buat)

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        {/* Navbar Sederhana (Opsional) */}
        <nav className="bg-white shadow p-4 mb-6">
          <div className="container mx-auto font-bold text-xl text-blue-600">
            JobPortal (Mode Dev)
          </div>
        </nav>

        <Routes>
          {/* Halaman Utama: Menampilkan List Job */}
          <Route path="/" element={<Jobs />} />
          
          {/* Halaman Detail: Menampilkan Detail Job berdasarkan ID */}
          <Route path="/jobs/:id" element={<JobDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;