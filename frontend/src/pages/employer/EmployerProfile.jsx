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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ✅ Integrasi Navbar */}
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Company Profile
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Kelola informasi perusahaan Anda untuk menarik kandidat terbaik.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm space-y-6"
                >
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input
                            label="Company Name"
                            name="company_name"
                            placeholder="Masukkan nama perusahaan"
                            value={form.company_name}
                            onChange={handleChange}
                        />
                        <Input
                            label="Location"
                            name="location"
                            placeholder="Contoh: Jakarta, Indonesia"
                            value={form.location}
                            onChange={handleChange}
                        />
                    </div>

                    <Input
                        label="Website"
                        name="website"
                        placeholder="https://www.perusahaan.com"
                        value={form.website}
                        onChange={handleChange}
                    />

                    <Textarea
                        label="Description"
                        name="description"
                        placeholder="Tuliskan deskripsi singkat mengenai perusahaan Anda..."
                        value={form.description}
                        onChange={handleChange}
                    />

                    {/* Feedback Message */}
                    {message.text && (
                        <div className={`text-sm px-4 py-3 rounded-lg font-medium border ${message.type === "success"
                                ? "bg-green-50 text-green-700 border-green-100"
                                : "bg-red-50 text-red-700 border-red-100"
                            }`}>
                            {message.type === "success" ? "✅ " : "⚠️ "} {message.text}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end">
                        <button
                            disabled={saving}
                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Menyimpan...
                                </span>
                            ) : (
                                "Simpan Perubahan"
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

// ✅ Komponen Input Modern (Tanpa efek hover berlebih)
function Input({ label, ...props }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>
            <input
                {...props}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400"
            />
        </div>
    );
}

// ✅ Komponen Textarea Modern
function Textarea({ label, ...props }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>
            <textarea
                {...props}
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400 leading-relaxed"
            />
        </div>
    );
}