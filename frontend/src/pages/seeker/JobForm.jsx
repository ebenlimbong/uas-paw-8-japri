import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../api/client";
import Navbar from "../../components/Navbar";

export default function JobForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
    type: "Full-time",
  });

  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      apiFetch(`/jobs/${id}`).then((res) => {
        if (res.success) setForm(res.data);
      });
    }
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isEdit ? `/jobs/${id}` : "/jobs";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(form),
      });

      if (res.success) navigate("/employer/jobs");
    } catch {
      alert("Gagal menyimpan job");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">
          {isEdit ? "Edit Job" : "Post New Job"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["title", "location", "salary"].map((field) => (
            <input
              key={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={field}
              className="w-full border p-3 rounded-lg"
            />
          ))}

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Job description"
            className="w-full border p-3 rounded-lg"
          />

          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            placeholder="Requirements"
            className="w-full border p-3 rounded-lg"
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Intern</option>
            <option>Remote</option>
          </select>

          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold">
            {isEdit ? "Update Job" : "Create Job"}
          </button>
        </form>
      </div>
    </>
  );
}
