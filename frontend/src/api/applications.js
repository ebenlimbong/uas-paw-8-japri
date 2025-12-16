import { apiFetch } from './client';

// Job Seeker - Apply to job
export const applyToJob = async (jobId) => {
  return apiFetch(`/api/jobs/${jobId}/apply`, {
    method: 'POST',
  });
};

// Job Seeker - Get my applications
export const getMyApplications = async () => {
  return apiFetch('/api/applications/me');
};

// Employer - Get applicants for a job
export const getJobApplicants = async (jobId) => {
  return apiFetch(`/api/jobs/${jobId}/applications`);
};

// Employer - Update application status
export const updateApplicationStatus = async (applicationId, status) => {
  return apiFetch(`/api/applications/${applicationId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};

// Job Seeker - Save a job
export const saveJob = async (jobId) => {
  return apiFetch(`/api/jobs/${jobId}/save`, {
    method: 'POST',
  });
};

// Job Seeker - Get saved jobs
export const getSavedJobs = async () => {
  return apiFetch('/api/saved_jobs/me');
};

// Job Seeker - Unsave a job
export const unsaveJob = async (savedJobId) => {
  return apiFetch(`/api/saved-jobs/${savedJobId}`, {
    method: 'DELETE',
  });
};
