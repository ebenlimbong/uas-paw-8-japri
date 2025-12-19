import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { publicFetch } from "../../api/public";
// ✅ 1. Import yang dibutuhkan (Auth & Client API)
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/client";
import Navbar from "../../components/Navbar";

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { publicFetch } from '../api/public';
// ✅ STEP 2: Menggunakan apiFetch agar token auth terkirim saat cek status
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    // ======================
    // States: Apply Job
    // ======================
    const [isApplied, setIsApplied] = useState(false);
    const [applyError, setApplyError] = useState("");
    const [applyLoading, setApplyLoading] = useState(false);

    // ======================
    // ✅ STRATEGI STATE: Save Job
    // ======================
    const [isSaved, setIsSaved] = useState(false);
    const [savedId, setSavedId] = useState(null); // Penting untuk DELETE
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState("");

    // ======================
    // Fetch Job Detail & Status (Sinkronisasi Backend)
    // ======================
    useEffect(() => {
        const fetchJobDetail = async () => {
            try {
                // 1. Ambil data detail pekerjaan
                const res = await apiFetch(`/jobs/${id}`);
                const jobData = res.data || res;
                setJob(jobData);

                // 2. Jika user login, cek status lamaran & status simpan
                if (isAuthenticated) {
                    // --- Cek Status Lamaran ---
                    const appRes = await apiFetch("/applications/me");
                    if (appRes.success && Array.isArray(appRes.data)) {
                        const hasApplied = appRes.data.some(app => app.job.id === parseInt(id));
                        setIsApplied(hasApplied);
                    }

                    // --- ✅ SINKRONISASI SAAT LOAD: Cek Saved Jobs ---
                    const savedRes = await apiFetch("/saved_jobs/me");
                    if (savedRes.success && Array.isArray(savedRes.data)) {
                        const saved = savedRes.data.find(
                            sj => sj.job.id === parseInt(id)
                        );

                        if (saved) {
                            setIsSaved(true);
                            setSavedId(saved.id); // Simpan ID SavedJob untuk keperluan Unsave
                        }
                    }
                }
            } catch (error) {
                console.error("Gagal sinkronisasi data pekerjaan atau status:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetail();
    }, [id, isAuthenticated]);

    // ======================
    // Handle Apply Job
    // ======================
    const handleApply = async () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        if (user.role !== "seeker") {
            setApplyError("Hanya job seeker yang dapat melamar pekerjaan.");
            return;
        }
        try {
            setApplyLoading(true);
            setApplyError("");
            const res = await apiFetch(`/jobs/${id}/apply`, {
                method: "POST",
                body: JSON.stringify({}),
            });
            if (res.success) {
                setIsApplied(true);
            } else {
                setApplyError(res.error || "Gagal melamar pekerjaan.");
            }
        } catch (err) {
            setApplyError("Terjadi kesalahan saat mengirim lamaran.");
        } finally {
            setApplyLoading(false);
        }
    };

    // ======================
    // ✅ HANDLE SAVE / UNSAVE
    // ======================
    const handleToggleSave = async () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (user.role !== "seeker") {
            setSaveError("Hanya seeker yang bisa menyimpan job.");
            return;
        }

        try {
            setSaveLoading(true);
            setSaveError("");

            if (!isSaved) {
                // --- PROSES SAVE (POST) ---
                const res = await apiFetch(`/jobs/${id}/save`, {
                    method: "POST",
                });

                if (res.success) {
                    // Refresh untuk mendapatkan savedId terbaru dari backend
                    const savedRes = await apiFetch("/saved_jobs/me");
                    const saved = savedRes.data.find(sj => sj.job.id === parseInt(id));

                    setIsSaved(true);
                    setSavedId(saved.id);
                } else {
                    setSaveError(res.error);
                }
            } else {
                // --- PROSES UNSAVE (DELETE) ---
                // Menggunakan savedId hasil sinkronisasi, bukan job_id
                const res = await apiFetch(`/saved-jobs/${savedId}`, {
                    method: "DELETE",
                });

                if (res.success) {
                    setIsSaved(false);
                    setSavedId(null);
                } else {
                    setSaveError(res.error);
                }
            }
        } catch (err) {
            setSaveError("Gagal memproses saved job.");
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!job) return <div className="text-center py-10">Pekerjaan tidak ditemukan.</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto mb-4">
                <Link to="/jobs" className="text-blue-600 hover:underline font-medium">
                    &larr; Kembali ke Daftar Pekerjaan
                </Link>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-blue-600 h-32 md:h-48 w-full relative"></div>

                <div className="px-8 pb-8">
                    <div className="relative -top-10 mb-5 flex items-end justify-between">
                        <div className="bg-white p-4 rounded-lg shadow-sm inline-block border">
                            {/* ✅ UI: TITLE & SAVE BUTTON (ICON) */}
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {job.title}
                                </h1>

                                <button
                                    onClick={handleToggleSave}
                                    disabled={saveLoading}
                                    className={`p-2 rounded-full transition shadow-sm
                    ${isSaved ? "bg-blue-100 text-blue-600" : "bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50"}
                  `}
                                    title={isSaved ? "Hapus dari Saved Jobs" : "Simpan Job"}
                                >
                                    {isSaved ? (
                                        // Filled Bookmark Icon
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M5 3a2 2 0 00-2 2v16l9-4 9 4V5a2 2 0 00-2-2H5z" />
                                        </svg>
                                    ) : (
                                        // Outline Bookmark Icon
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3-7 3V5z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <p className="text-blue-600 font-medium text-lg mt-1">
                                {job.company_name}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 mb-8 text-sm text-gray-600">
                        <span className="bg-gray-100 px-3 py-1 rounded-full">📍 {job.location}</span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                            💰 Rp {job.salary?.toLocaleString('id-ID')}
                        </span>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                            💼 {job.type}
                        </span>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Deskripsi Pekerjaan</h2>
                        <div className="prose text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                            {job.description}
                        </div>

                        <h2 className="text-xl font-bold mt-8 mb-4 text-gray-800">Persyaratan</h2>
                        <div className="prose text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                            {job.requirements}
                        </div>
                    </div>

                    {/* ✅ ERROR MESSAGE DISPLAY */}
                    {(applyError || saveError) && (
                        <div className="mt-6 space-y-2">
                            {applyError && (
                                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg border border-red-100 text-sm font-medium">
                                    ⚠️ {applyError}
                                </div>
                            )}
                            {saveError && (
                                <div className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-lg border border-yellow-100 text-sm font-medium">
                                    ⚠️ {saveError}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-10 border-t pt-6 flex justify-end">
                        <button
                            onClick={handleApply}
                            disabled={isApplied || applyLoading}
                            className={`font-bold py-3 px-10 rounded-lg shadow-lg transition duration-200
                ${isApplied
                                    ? "bg-green-500 text-white cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 text-white"
                                }
              `}
                        >
                            {isApplied
                                ? "Sudah Melamar ✓"
                                : applyLoading
                                    ? "Mengirim Lamaran..."
                                    : "Lamar Sekarang"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;