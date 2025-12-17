import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State form local (agar input form terisi sesuai URL)
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('loc') || '');
  const [jobType, setJobType] = useState(searchParams.get('type') || '');
  const [salaryRange, setSalaryRange] = useState(searchParams.get('sal') || '');

  // Fetch Data ke Backend
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const queryBackend = new URLSearchParams();
        
        // 1. Mapping Keyword & Location
        const qParam = searchParams.get('q');
        const locParam = searchParams.get('loc');
        const typeParam = searchParams.get('type');
        const salParam = searchParams.get('sal'); // format: "min-max"

        if (qParam) queryBackend.append('q', qParam); // Backend minta 'q'
        if (locParam) queryBackend.append('location', locParam); // Backend minta 'location'
        if (typeParam) queryBackend.append('type', typeParam); // Backend minta 'type'

        // 2. Mapping Salary (Pecah string "min-max")
        if (salParam) {
            const [min, max] = salParam.split('-');
            if (min) queryBackend.append('min_salary', min);
            if (max) queryBackend.append('max_salary', max);
        }

        // Panggil endpoint backend (pastikan path endpoint benar)
        // Jika route_name='job_search' biasanya pathnya /jobs atau /job_search
        const endpoint = `/jobs?${queryBackend.toString()}`; 
        
        console.log("Requesting:", endpoint); // Debugging URL

        const data = await apiFetch(endpoint);

        // Handle variasi response structure
        let jobList = [];
        if (data.success && Array.isArray(data.data)) {
             jobList = data.data; // Sesuai return python Anda: {success: true, data: []}
        } else if (Array.isArray(data)) {
             jobList = data;
        }

        setJobs(jobList);
        if (jobList.length > 0) setSelectedJob(jobList[0]);
        else setSelectedJob(null);

      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams]);

  // Handle Search Ulang di halaman ini
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if(keyword) params.append('q', keyword);
    if(location) params.append('loc', location);
    if(jobType) params.append('type', jobType);
    if(salaryRange) params.append('sal', salaryRange);

    navigate(`/jobs?${params.toString()}`);
  };

  const formatSalary = (salary) => {
    if (!salary) return '';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumSignificantDigits: 3 }).format(salary);
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Memuat lowongan...</div>;

  return (
    <div className="min-h-screen bg-[#f3f2f1] font-sans">
      
      {/* HEADER SEARCH BAR (Sticky) */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm pb-4 pt-2">
        <nav className="max-w-7xl mx-auto px-4 py-2 mb-2">
            <span className="text-blue-700 font-bold text-2xl cursor-pointer" onClick={() => navigate('/')}>jobportal</span>
        </nav>

        <div className="max-w-7xl mx-auto px-4">
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-2">
                <div className="flex-1 flex items-center border border-gray-400 rounded px-2 py-1 bg-white">
                    <span className="font-bold text-gray-500 text-sm mr-2">What</span>
                    <input className="w-full outline-none text-sm" placeholder="Keywords" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                </div>
                <div className="flex-1 flex items-center border border-gray-400 rounded px-2 py-1 bg-white">
                    <span className="font-bold text-gray-500 text-sm mr-2">Where</span>
                    <input className="w-full outline-none text-sm" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                
                {/* Dropdown Type Compact */}
                <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="border border-gray-400 rounded px-2 py-1 text-sm bg-white">
                    <option value="">Job Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Intern">Intern</option>
                    <option value="Remote">Remote</option>
                </select>

                {/* Dropdown Salary Compact */}
                <select value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} className="border border-gray-400 rounded px-2 py-1 text-sm bg-white">
                    <option value="">Salary Estimate</option>
                    <option value="0-5000000">&lt; 5jt</option>
                    <option value="5000000-10000000">5jt - 10jt</option>
                    <option value="10000000-20000000">10jt - 20jt</option>
                    <option value="20000000-999999999">&gt; 20jt</option>
                </select>

                <button type="submit" className="bg-blue-700 text-white font-bold px-4 py-1 rounded hover:bg-blue-800">Find jobs</button>
            </form>
        </div>
      </div>

      {/* SPLIT VIEW CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6 items-start">
        
        {/* LIST (KIRI) */}
        <div className="w-full md:w-5/12 flex flex-col gap-3">
            <div className="text-sm text-gray-500 mb-2">
                Found {jobs.length} jobs
            </div>

            {jobs.length === 0 ? (
                <div className="bg-white p-6 rounded border text-center">Tidak ada lowongan yang cocok dengan filter.</div>
            ) : (
                jobs.map((job) => (
                    <div 
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className={`cursor-pointer p-4 rounded-lg border hover:shadow-md transition bg-white ${selectedJob?.id === job.id ? 'border-2 border-blue-600' : 'border-gray-300'}`}
                    >
                        <h2 className="text-lg font-bold text-blue-700">{job.title}</h2>
                        <div className="text-sm text-gray-800">{job.company_name}</div>
                        <div className="text-sm text-gray-500 mb-2">{job.location}</div>
                        <div className="flex flex-wrap gap-2 text-xs">
                            {job.type && <span className="bg-gray-100 px-2 py-1 rounded font-bold text-gray-600">{job.type}</span>}
                            {job.salary && <span className="bg-green-50 px-2 py-1 rounded font-bold text-green-700">{formatSalary(job.salary)}</span>}
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* DETAIL (KANAN) */}
        <div className="hidden md:block md:w-7/12 sticky top-48 h-[calc(100vh-200px)]">
            {selectedJob ? (
                <div className="bg-white border border-gray-300 rounded-lg shadow-sm h-full flex flex-col overflow-hidden">
                    <div className="p-6 border-b shadow-sm z-10 bg-white">
                        <h1 className="text-2xl font-bold mb-2">{selectedJob.title}</h1>
                        <div className="text-sm text-gray-600 mb-4">{selectedJob.company_name} &bull; {selectedJob.location}</div>
                        <button className="bg-blue-700 text-white font-bold py-2 px-6 rounded-md">Apply now</button>
                    </div>
                    <div className="p-6 overflow-y-auto flex-1">
                        <h3 className="font-bold text-lg mb-2">Job details</h3>
                        <div className="mb-4">
                            <p className="font-bold text-sm text-gray-700">Type: <span className="font-normal">{selectedJob.type}</span></p>
                            <p className="font-bold text-sm text-gray-700">Salary: <span className="font-normal">{formatSalary(selectedJob.salary)}</span></p>
                        </div>
                        <hr className="my-4"/>
                        <h3 className="font-bold text-lg mb-2">Description</h3>
                        <p className="whitespace-pre-wrap text-gray-800 text-sm">{selectedJob.description}</p>
                        
                        {selectedJob.requirements && (
                           <div className="mt-4">
                               <h3 className="font-bold text-lg mb-2">Requirements</h3>
                               <p className="whitespace-pre-wrap text-gray-800 text-sm">{selectedJob.requirements}</p>
                           </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="h-full flex items-center justify-center bg-white border rounded-lg"><p className="text-gray-400">Pilih pekerjaan untuk melihat detail</p></div>
            )}
        </div>

      </div>
    </div>
  );
};

export default Jobs;