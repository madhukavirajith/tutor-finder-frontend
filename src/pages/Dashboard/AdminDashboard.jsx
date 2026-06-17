import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  ShieldCheckIcon, 
  MapPinIcon, 
  BookOpenIcon, 
  CheckIcon, 
  XMarkIcon,
  AcademicCapIcon,
  InboxIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const AdminDashboard = () => {
  const [pendingTutors, setPendingTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);

  const fetchPendingTutors = async () => {
    try {
      const { data } = await api.get('/admin/tutors/pending');
      setPendingTutors(data);
    } catch (err) {
      toast.error('Failed to load pending tutor verifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTutors();
  }, []);

  const handleApprove = async (id) => {
    setActioningId(id);
    try {
      await api.post(`/admin/tutors/${id}/approve`);
      toast.success('Tutor profile successfully approved and published!');
      setPendingTutors(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      toast.error('Failed to approve profile');
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id) => {
    setActioningId(id);
    try {
      await api.post(`/admin/tutors/${id}/reject`);
      toast.success('Tutor profile rejected.');
      setPendingTutors(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      toast.error('Failed to reject profile');
    } finally {
      setActioningId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      {/* Premium Admin Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-primary-600 mr-2" /> Admin Moderation Console
          </h1>
          <p className="mt-2 text-sm text-gray-600">Review, verify, and approve tutor applications to access search listings.</p>
        </div>
        <div className="mt-4 sm:mt-0 bg-primary-100 text-primary-800 text-xs px-3 py-1.5 rounded-full font-bold self-start">
          {pendingTutors.length} Application{pendingTutors.length !== 1 ? 's' : ''} Pending
        </div>
      </div>

      {/* Main Moderation Interface */}
      {pendingTutors.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white border rounded-2xl shadow-sm p-6"
        >
          <InboxIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800">Clear queue!</h3>
          <p className="text-gray-500 mt-1">There are no pending tutor profiles waiting for approval at this time.</p>
        </motion.div>
      ) : (
        <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold">
                <tr>
                  <th scope="col" className="px-6 py-4">Tutor details</th>
                  <th scope="col" className="px-6 py-4">Location</th>
                  <th scope="col" className="px-6 py-4">Bio / Qualifications</th>
                  <th scope="col" className="px-6 py-4">Subjects</th>
                  <th scope="col" className="px-6 py-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {pendingTutors.map((tutor) => (
                  <motion.tr 
                    layout
                    key={tutor.id}
                    className="hover:bg-gray-50/50 transition-colors align-top"
                  >
                    {/* Name & Contact */}
                    <td className="px-6 py-5">
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                          {tutor.fullName ? tutor.fullName.charAt(0).toUpperCase() : <AcademicCapIcon className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-base">{tutor.fullName || 'Unnamed Tutor'}</p>
                          <p className="text-xs text-gray-500">{tutor.user?.email}</p>
                          <p className="text-xs text-gray-500 mt-1">{tutor.phoneNumber || 'No phone'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-5">
                      <div className="flex items-center text-gray-700 mt-0.5">
                        <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{tutor.location || 'Remote'}</span>
                      </div>
                    </td>

                    {/* Bio Biography */}
                    <td className="px-6 py-5 max-w-xs">
                      <p className="text-gray-600 text-xs line-clamp-3 leading-relaxed">
                        {tutor.bio || 'No description provided.'}
                      </p>
                    </td>

                    {/* Subjects */}
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1">
                        {tutor.subjects && tutor.subjects.length > 0 ? (
                          tutor.subjects.map((sub) => (
                            <span 
                              key={sub.id} 
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-800 border border-primary-100"
                            >
                              <BookOpenIcon className="h-3 w-3 mr-0.5" /> {sub.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">None selected</span>
                        )}
                      </div>
                    </td>

                    {/* Moderate Actions */}
                    <td className="px-6 py-5 text-right font-medium">
                      <div className="flex justify-end space-x-2">
                        {/* Approve Button */}
                        <button
                          onClick={() => handleApprove(tutor.id)}
                          disabled={actioningId !== null}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-semibold rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-all"
                        >
                          <CheckIcon className="h-3.5 w-3.5 mr-1" /> Approve
                        </button>

                        {/* Reject Button */}
                        <button
                          onClick={() => handleReject(tutor.id)}
                          disabled={actioningId !== null}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-semibold rounded-lg shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 transition-all"
                        >
                          <XMarkIcon className="h-3.5 w-3.5 mr-1" /> Reject
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;