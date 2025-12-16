import { useEffect, useState } from "react";
import { getJobs } from "../api/jobs";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getJobs().then(res => setJobs(res.data || []));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Job List</h1>

      {jobs.map(job => (
        <div key={job.id} className="border p-4 mb-3 rounded">
          <h2 className="font-semibold">{job.title}</h2>
          <p>{job.location}</p>
          <p>Rp {job.salary}</p>
        </div>
      ))}
    </div>
  );
}
