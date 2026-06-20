import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  AcademicCapIcon, 
  ShieldCheckIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { getTutorById, revealContact as apiRevealContact } from '../services/tutors';
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
  const [isRevealing, setIsRevealing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTutor = useCallback(async () => {
    try {
      const { data } = await getTutorById(id);
      setTutor(data);
    } catch (error) {
      console.error('Failed to load tutor profile');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTutor();
  }, [fetchTutor]);

  const handleRevealContact = async () => {
    if (!user) {
      toast.error('Please login to view contact information');
      return;
    }
    setIsRevealing(true);
    try {
      const { data } = await apiRevealContact(id);
      setPhoneNumber(data.phoneNumber);
      setShowPhone(true);
      toast.success('Contact details revealed!');

      // Save to contacted list in localStorage for parent history log
      const contactedRaw = localStorage.getItem('contacted_tutors');
      const contactedList = contactedRaw ? JSON.parse(contactedRaw) : [];
      if (tutor && !contactedList.some(t => t.id === tutor.id)) {
        contactedList.push({
          id: tutor.id,
          fullName: tutor.fullName,
          location: tutor.location,
          email: tutor.user?.email,
          phoneNumber: data.phoneNumber,
          subjects: tutor.subjects || []
        });
        localStorage.setItem('contacted_tutors', JSON.stringify(contactedList));
      }
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setIsRevealing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    toast.success('Phone number copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
      <Loader />
    </div>
  );
  
  if (!tutor) return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <AcademicCapIcon className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-bold text-gray-950">Tutor not found</h3>
      <p className="text-gray-500 mt-1">The requested profile does not exist or has been removed.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl shadow-gray-150/40 border border-gray-100 overflow-hidden"
        >
          {/* Header Banner */}
          <div className="h-44 relative overflow-hidden bg-gradient-to-r from-primary-900 via-primary-800 to-indigo-950 group">
            {tutor.bannerImageUrl ? (
              <>
                <img 
                  src={tutor.bannerImageUrl} 
                  alt="Tutor Leaflet Banner" 
                  className="w-full h-full object-cover cursor-zoom-in hover:opacity-90 transition-opacity" 
                  onClick={() => setIsModalOpen(true)}
                />
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/85 backdrop-blur-sm text-white text-xs px-3.5 py-1.5 rounded-lg border border-white/20 transition-all font-semibold opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  View Full Leaflet
                </button>
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem]" />
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary-500/20 blur-[50px]" />
              </>
            )}
          </div>

          <div className="px-6 sm:px-10 pb-10">
            {/* Header Avatar and Vetted Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-8 gap-5 text-center sm:text-left">
              <div className="w-32 h-32 rounded-3xl border-4 border-white bg-gradient-to-br from-primary-500 to-indigo-600 shadow-xl flex items-center justify-center text-white overflow-hidden relative">
                {tutor.profileImageUrl ? (
                  <img src={tutor.profileImageUrl} alt={tutor.fullName} className="w-full h-full object-cover animate-fade-in" />
                ) : (
                  <AcademicCapIcon className="h-16 w-16 text-white/95" />
                )}
              </div>
              <div className="sm:mb-2 space-y-1">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{tutor.fullName}</h1>
                  <span className="flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-150">
                    <ShieldCheckIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                    Verified Partner
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start text-gray-500 text-sm font-semibold mt-1 bg-gray-100/70 py-0.5 px-3 rounded-full w-fit">
                  <MapPinIcon className="h-4 w-4 mr-1 text-primary-500" />
                  {tutor.location || 'Remote'}
                </div>
              </div>
            </div>

            {/* Profile Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Biography & Subjects */}
              <div className="md:col-span-8 space-y-8">
                {/* Biography */}
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="h-5 w-1 bg-primary-600 rounded-full" />
                    About Me
                  </h2>
                  <p className="text-gray-650 leading-relaxed text-sm font-medium whitespace-pre-line bg-gray-50/50 p-6 rounded-2xl border border-gray-100/80">
                    {tutor.bio || 'This professional tutor has not written a custom biography yet. Contact them to inquire about background and teaching styles.'}
                  </p>
                </div>

                {/* Subjects */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="h-5 w-1 bg-primary-600 rounded-full" />
                    Subjects Offered
                  </h2>
                  <div className="flex flex-wrap gap-2.5 bg-gray-50/50 p-6 rounded-2xl border border-gray-100/80">
                    {tutor.subjects && tutor.subjects.length > 0 ? (
                      tutor.subjects.map(subject => (
                        <span 
                          key={subject.id} 
                          className="px-4 py-2 bg-white text-primary-950 font-bold rounded-xl text-sm border border-gray-200 shadow-sm hover:border-primary-400 hover:bg-primary-50/20 transition-all cursor-default"
                        >
                          {subject.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm italic">No subjects configured.</span>
                    )}
                  </div>
                </div>

                {/* Leaflet / Flyer Full Display */}
                {tutor.bannerImageUrl && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <span className="h-5 w-1 bg-primary-600 rounded-full" />
                      Tutor Flyer / Leaflet
                    </h2>
                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100/80 flex justify-center">
                      <div 
                        className="max-w-md w-full rounded-2xl overflow-hidden border border-gray-200 shadow-md cursor-zoom-in group relative"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <img 
                          src={tutor.bannerImageUrl} 
                          alt="Tutor Flyer" 
                          className="w-full h-auto object-contain hover:scale-[1.01] transition-transform duration-200" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <span className="bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to Zoom
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Sticky Contact details Widget */}
              <div className="md:col-span-4 md:sticky md:top-24 space-y-6">
                <div className="bg-gradient-to-b from-white to-gray-50/40 p-6 rounded-2xl border border-gray-200/60 shadow-lg shadow-gray-100/30 space-y-6">
                  <h3 className="text-lg font-bold text-gray-900">Contact Details</h3>
                  
                  <div className="space-y-4">
                    {/* Email field */}
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <div className="p-2.5 bg-primary-50 rounded-lg text-primary-600">
                        <EnvelopeIcon className="h-5 w-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Email Address</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{tutor.user?.email}</p>
                      </div>
                    </div>

                    {/* Phone field */}
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600">
                        <PhoneIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Phone Number</p>
                        <AnimatePresence mode="wait">
                          {!showPhone ? (
                            <motion.span 
                              key="hidden-tag"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-sm font-bold text-gray-400 tracking-widest"
                            >
                              •••••••••••
                            </motion.span>
                          ) : (
                            <motion.p 
                              key="visible-tag"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-sm font-bold text-gray-800 truncate"
                            >
                              {phoneNumber}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Reveal button widget */}
                  <div className="pt-2">
                    {!showPhone ? (
                      <button
                        onClick={handleRevealContact}
                        disabled={isRevealing}
                        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                      >
                        {isRevealing ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Revealing details...</span>
                          </>
                        ) : (
                          <>
                            <LockClosedIcon className="h-4.5 w-4.5" />
                            <span>Reveal Contact Number</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={copyToClipboard}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        {copied ? (
                          <>
                            <CheckIcon className="h-4.5 w-4.5 text-emerald-600" />
                            <span>Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <DocumentDuplicateIcon className="h-4.5 w-4.5 text-gray-500" />
                            <span>Copy Phone Number</span>
                          </>
                        )}
                      </button>
                    )}
                    
                    {!user && (
                      <p className="text-[10px] text-gray-400 text-center mt-2.5">
                        * Authentication required to request contact info.
                      </p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal for Leaflet */}
      <AnimatePresence>
        {isModalOpen && tutor.bannerImageUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl p-2 flex flex-col items-center"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 bg-gray-900/60 hover:bg-gray-900/80 backdrop-blur-md text-white rounded-full p-2.5 transition-all shadow-md z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="overflow-y-auto w-full flex justify-center bg-gray-50 rounded-2xl">
                <img 
                  src={tutor.bannerImageUrl} 
                  alt="Full Tutor Leaflet" 
                  className="max-w-full h-auto max-h-[85vh] object-contain rounded-xl"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TutorProfile;