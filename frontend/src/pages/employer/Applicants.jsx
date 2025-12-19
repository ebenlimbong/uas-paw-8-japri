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

}
