import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobApplicants, updateApplicationStatus } from '../../api/applications';
import Layout from '../../components/Layout';

const ViewApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [jobInfo, setJobInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const data = await getJobApplicants(jobId);
      const list = data.data || data.applications || data || [];
      setApplicants(Array.isArray(list) ? list : []);
      if (data.job) setJobInfo(data.job);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setUpdating(applicationId);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setApplicants(applicants.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Gagal mengupdate status');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'shortlisted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="mb-8">
          <Link to="/employer/dashboard" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
            ← Kembali ke Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Daftar Pelamar</h1>
          {jobInfo && (
            <p className="text-gray-600 mt-2">
              Untuk posisi: <span className="font-semibold">{jobInfo.title}</span>
            </p>
          )}
        </div>

        {applicants.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Pelamar</h2>
            <p className="text-gray-600">Belum ada yang melamar untuk posisi ini</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applicants.map((applicant) => (
              <div 
                key={applicant.id} 
                className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Applicant Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                        👤
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {applicant.seeker?.user?.name || applicant.name || 'Pelamar'}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {applicant.seeker?.user?.email || applicant.email || '-'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Skills:</span>
                        <p className="text-gray-700 mt-1">
                          {applicant.seeker?.skills || '-'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Experience:</span>
                        <p className="text-gray-700 mt-1 line-clamp-2">
                          {applicant.seeker?.experience || '-'}
                        </p>
                      </div>
                    </div>

                    {applicant.seeker?.cv_url && (
                      <a 
                        href={applicant.seeker.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-blue-600 hover:underline text-sm"
                      >
                        📄 Lihat CV
                      </a>
                    )}

                    <div className="mt-3 text-xs text-gray-400">
                      Dilamar: {applicant.applied_date || '-'}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(applicant.status)}`}>
                      {applicant.status?.charAt(0).toUpperCase() + applicant.status?.slice(1) || 'Pending'}
                    </span>
                    
                    <div className="flex gap-2">
                      {applicant.status !== 'shortlisted' && (
                        <button
                          onClick={() => handleStatusUpdate(applicant.id, 'shortlisted')}
                          disabled={updating === applicant.id}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
                        >
                          ✅ Shortlist
                        </button>
                      )}
                      {applicant.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusUpdate(applicant.id, 'rejected')}
                          disabled={updating === applicant.id}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
                        >
                          ❌ Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ViewApplicants;
