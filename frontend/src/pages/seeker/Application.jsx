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

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-500 text-sm mt-1">
              Lihat status lamaran pekerjaan kamu.
            </p>
          </div>

          <button
            onClick={fetchApplications}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {/* Tabs status */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: "all", label: `All (${countByStatus.all})` },
            { key: "pending", label: `Pending (${countByStatus.pending})` },
            { key: "shortlisted", label: `Shortlisted (${countByStatus.shortlisted})` },
            { key: "rejected", label: `Rejected (${countByStatus.rejected})` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveStatus(t.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition
                ${activeStatus === t.key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}
              `}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="bg-white border rounded-xl p-10 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <p className="text-gray-500 mt-3">Loading applications...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
            <div className="mt-3">
              <button
                onClick={fetchApplications}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
              >
                Coba lagi
              </button>
            </div>
          </div>
        )}

        {!loading && !error && filteredApps.length === 0 && (
          <div className="bg-white border rounded-xl p-10 text-center">
            <p className="text-gray-500">
              Belum ada lamaran. Cari pekerjaan dulu di halaman Jobs.
            </p>
            <Link
              to="/jobs"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg"
            >
              Cari Pekerjaan
            </Link>
          </div>
        )}

        {!loading && !error && filteredApps.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredApps.map((app) => {
              const meta = STATUS_META[app.status] || {
                label: app.status,
                cls: "bg-gray-50 text-gray-700 border-gray-200",
              };

              return (
                <div key={app.application_id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{app.job?.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        📍 {app.job?.location || "-"} •  {app.job?.type || "-"}
                      </p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${meta.cls}`}>
                      {meta.label}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                       Rp {formatIDR(app.job?.salary)}
                    </span>
                    <span className="bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                      🗓 {app.applied_date}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      Application ID: {app.application_id}
                    </p>

                    <Link
                      to={`/jobs/${app.job?.id}`}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Lihat Job →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}