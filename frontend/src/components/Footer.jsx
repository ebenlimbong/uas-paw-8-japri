import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">JobPortal</h3>
            <p className="text-sm">
              Platform lowongan kerja terpercaya untuk menghubungkan pencari kerja dengan perusahaan terbaik.
            </p>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="text-white font-semibold mb-4">Untuk Pencari Kerja</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-white transition">Cari Lowongan</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Daftar Akun</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Masuk</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="text-white font-semibold mb-4">Untuk Perusahaan</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-white transition">Daftar Employer</Link></li>
              <li><Link to="/employer/post-job" className="hover:text-white transition">Posting Lowongan</Link></li>
              <li><Link to="/employer/dashboard" className="hover:text-white transition">Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 support@jobportal.com</li>
              <li>📞 (021) 123-4567</li>
              <li>📍 Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
