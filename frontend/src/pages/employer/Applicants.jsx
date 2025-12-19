import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../../api/client";
import Navbar from "../../components/Navbar";

export default function EmployerApplicants() {
    const { jobId } = useParams();

    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================
    // Fetch Applicants
    // ==========================
    const fetchApplicants = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await apiFetch(`/jobs/${jobId}/applications`);

            if (res.success) {
                setJob(res.job);
                setApplications(res.data);
            } else {
                setError(res.error || "Gagal mengambil data pelamar");
            }
        } catch (err) {
            console.error(err);
            setError("Terjadi kesalahan saat mengambil data pelamar");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, [jobId]);

    // ==========================
    // Update Status Application
    // ==========================
    const updateStatus = async (applicationId, status) => {
        try {
            const res = await apiFetch(
                `/applications/${applicationId}/status`,
                {
                    method: "PUT",
                    body: JSON.stringify({ status }),
                }
            );

            if (res.success) {
                fetchApplicants(); // refresh data
            } else {
                alert(res.error || "Gagal update status");
            }
        } catch {
            alert("Terjadi kesalahan saat update status");
        }
    };

    // ==========================
    // UI STATES
    // ==========================
    if (loading) {
        return <div className="p-10 text-center">Loading applicants...</div>;
    }

    return (
        <>
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-10">
                <Link
                    to="/employer/jobs"
                    className="text-blue-600 hover:underline"
                >
                    ← Kembali ke Manage Jobs
                </Link>

                <h1 className="text-2xl font-bold mt-4">
                    Applicants for: {job?.title}
                </h1>

                <p className="text-gray-500 mb-6">
                    Total pelamar: {applications.length}
                </p>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded mb-4">
                        {error}
                    </div>
                )}

                {applications.length === 0 ? (
                    <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                        Belum ada pelamar untuk job ini.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {applications.map((app) => (
                            <div
                                key={app.application_id}
                                className="bg-white border rounded-xl p-5 flex justify-between items-start"
                            >
                                {/* LEFT */}
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {app.seeker.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {app.seeker.email}
                                    </p>

                                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                                        <p>
                                            <strong>Skills:</strong>{" "}
                                            {app.seeker.skills || "-"}
                                        </p>
                                        <p>
                                            <strong>Experience:</strong>{" "}
                                            {app.seeker.experience || "-"}
                                        </p>
                                    </div>

                                    {app.seeker.cv_url && (
                                        <a
                                            href={app.seeker.cv_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-block mt-2 text-blue-600 text-sm hover:underline"
                                        >
                                            Lihat CV
                                        </a>
                                    )}
                                </div>

                                {/* RIGHT */}
                                <div className="text-right space-y-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold
                        ${app.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : app.status === "shortlisted"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }
                        `}
                                    >
                                        {app.status}
                                    </span>

                                    <p className="text-xs text-gray-400">
                                        Applied: {app.applied_date}
                                    </p>

                                    {/* ACTIONS */}
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={() =>
                                                updateStatus(app.application_id, "shortlisted")
                                            }
                                            className="text-green-600 text-sm hover:underline"
                                        >
                                            Shortlist
                                        </button>
                                        <button
                                            onClick={() =>
                                                updateStatus(app.application_id, "rejected")
                                            }
                                            className="text-red-600 text-sm hover:underline"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}