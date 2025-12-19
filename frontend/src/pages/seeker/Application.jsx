import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { apiFetch } from "../../api/client";

const STATUS_META = {
  pending: { label: "Pending", cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  shortlisted: { label: "Shortlisted", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  rejected: { label: "Rejected", cls: "bg-red-50 text-red-700 border-red-200" },
};

export default function SeekerApplications() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apps, setApps] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");

  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/applications/me");

      if (!res.success) throw new Error(res.error || "Gagal memuat applications");

      setApps(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApps = useMemo(() => {
    if (activeStatus === "all") return apps;
    return apps.filter((a) => a.status === activeStatus);
  }, [apps, activeStatus]);

  const countByStatus = useMemo(() => {
    const counts = { all: apps.length, pending: 0, shortlisted: 0, rejected: 0 };
    for (const a of apps) {
      if (counts[a.status] !== undefined) counts[a.status]++;
    }
    return counts;
  }, [apps]);

  const formatIDR = (n) => {
    if (n === null || n === undefined) return "-";
    return new Intl.NumberFormat("id-ID").format(n);
  };