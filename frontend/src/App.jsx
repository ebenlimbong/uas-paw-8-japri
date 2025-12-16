import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';       // <-- Import Home yang baru dibuat
import Jobs from './pages/Jobs';       // <-- Import Jobs
import JobDetail from './pages/JobDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Utama adalah Home ala Indeed */}
        <Route path="/" element={<Home />} />
        
        {/* Halaman Hasil Pencarian / List Lowongan */}
        <Route path="/jobs" element={<Jobs />} />
        
        {/* Halaman Detail */}
        <Route path="/jobs/:id" element={<JobDetail />} />
      </Routes>
    </Router>
  );
}

export default App;