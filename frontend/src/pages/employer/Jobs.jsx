import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../api/client";
import Navbar from "../../components/Navbar";

export default function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================
  // FETCH JOBS (EMPLOYER ONLY)
  // =====================
  const fetchJobs = async () => {
    setLoading(true);
    try {
      // 🔥 FIX UTAMA: pakai endpoint khusus employer
      const res = await apiFetch("/employer/jobs");

      if (res.success) {
        setJobs(res.data);
      }
    } catch (err) {
      console.error("Gagal load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // DELETE JOB
  // =====================
  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus job ini?"
    );
    if (!confirmDelete) return;

    try {
      const res = await apiFetch(`/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (res.success) {
        fetchJobs(); // refresh list
      } else {
        alert(res.error || "Gagal menghapus job");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus job");
    }
  };

  // =====================
  // INIT
  // =====================
  useEffect(() => {
    fetchJobs();
  }, []);