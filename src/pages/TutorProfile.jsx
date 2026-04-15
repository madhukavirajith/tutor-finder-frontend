import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, AcademicCapIcon, StarIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TutorProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    fetchTutor();
  }, [id]);

  const fetchTutor = async () => {
    try {
      const { data } = await api.get(`/public/tutors/${id}`);
      setTutor(data);
    } catch (error) {
      console.error('Failed to load tutor profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRevealContact = async () => {
    if (!user) {
      toast.error('Please login to view contact information');
      return;
    }
    try {
      const { data } = await api.post(`/tutors/${id}/contact`);
      setPhoneNumber(data.phoneNumber);
      setShowPhone(true);
    } catch (error) {
      // Error handled by interceptor
    }
  };

  if (loading) return <Loader />;
  if (!tutor) return <div className="text-center py-12">Tutor not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 h-32"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-primary-100 flex items-center justify-center">
              {tutor.profileImageUrl ? (
                <img src={tutor.profileImageUrl} alt={tutor.fullName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <AcademicCapIcon className="h-12 w-12 text-primary-600" />
              )}
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{tutor.fullName}</h1>
              <div className="flex items-center justify-center sm:justify-start mt-1 text-gray-600">
                <MapPinIcon className="h-5 w-5 mr-1" />
                {tutor.location || 'Remote'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">About</h2>
                <p className="text-gray-700">{tutor.bio || 'No bio provided.'}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-3">Subjects</h2>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects?.map(subject => (
                    <span key={subject.id} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                      {subject.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Contact</h2>
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{tutor.user?.email}</span>
                </div>
                <div>
                  {!showPhone ? (
                    <button
                      onClick={handleRevealContact}
                      className="btn-primary w-full flex items-center justify-center"
                    >
                      <PhoneIcon className="h-5 w-5 mr-2" />
                      Reveal Phone Number
                    </button>
                  ) : (
                    <div className="flex items-center text-gray-700">
                      <PhoneIcon className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="font-medium">{phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TutorProfile;