import { useEffect, useState } from "react";
import { apiFetch } from "../../api/client";
// ✅ Import Navbar
import Navbar from "../../components/Navbar";

export default function EmployerProfile() {
    const [form, setForm] = useState({
        company_name: "",
        description: "",
        website: "",
        location: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        const fetchCompanyProfile = async () => {
            try {
                const res = await apiFetch("/company/me");
                if (res.data) {
                    // Hanya mengambil field yang diperlukan agar tidak mengacaukan state form
                    setForm({
                        company_name: res.data.company_name || "",
                        description: res.data.description || "",
                        website: res.data.website || "",
                        location: res.data.location || "",
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyProfile();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await apiFetch("/company/me", {
                method: "PUT",
                body: JSON.stringify(form),
            });

            if (res.success) {
                setMessage({ type: "success", text: "Company profile berhasil disimpan." });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Gagal menyimpan company profile." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }