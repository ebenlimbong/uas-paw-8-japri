import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

const Home = () => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, isSeeker, isEmployer } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?q=${keyword}&loc=${location}`);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Temukan Pekerjaan
              <span className="block text-blue-200">Impian Anda</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Platform lowongan kerja terpercaya untuk menghubungkan pencari kerja dengan perusahaan terbaik di Indonesia
            </p>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  Posisi / Kata Kunci
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Frontend Developer, Marketing..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  Lokasi
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Jakarta, Bandung..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition duration-200 shadow-lg hover:shadow-xl"
                >
                  🔍 Cari Lowongan
                </button>
              </div>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold">10,000+</div>
              <div className="text-blue-200 text-sm mt-1">Lowongan Aktif</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold">5,000+</div>
              <div className="text-blue-200 text-sm mt-1">Perusahaan</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold">50,000+</div>
              <div className="text-blue-200 text-sm mt-1">Pencari Kerja</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih JobPortal?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Platform terlengkap untuk mencari pekerjaan atau merekrut kandidat terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pencarian Mudah</h3>
              <p className="text-gray-600">
                Filter lowongan berdasarkan lokasi, gaji, tipe pekerjaan, dan kata kunci
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lamar Cepat</h3>
              <p className="text-gray-600">
                Lamar pekerjaan dengan satu klik dan pantau status lamaran Anda
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Perusahaan Terpercaya</h3>
              <p className="text-gray-600">
                Terhubung dengan ribuan perusahaan terkemuka di Indonesia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap Memulai Karir Impian Anda?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Daftar sekarang dan temukan ribuan peluang pekerjaan yang menanti Anda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition duration-200 shadow-lg"
                >
                  Daftar Sebagai Pencari Kerja
                </Link>
                <Link
                  to="/register"
                  className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-8 rounded-xl transition duration-200"
                >
                  Daftar Sebagai Perusahaan
                </Link>
              </>
            ) : isSeeker ? (
              <Link
                to="/jobs"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition duration-200 shadow-lg"
              >
                Jelajahi Lowongan
              </Link>
            ) : isEmployer ? (
              <Link
                to="/employer/post-job"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition duration-200 shadow-lg"
              >
                Posting Lowongan
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
