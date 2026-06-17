import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ParentDashboard = () => {
  const { user } = useAuth();
  const [contactedTutors, setContactedTutors] = useState([]);
  const [activeTab, setActiveTab] = useState('contacts'); // 'contacts' | 'safety'

  useEffect(() => {
    const contactedRaw = localStorage.getItem('contacted_tutors');
    if (contactedRaw) {
      setContactedTutors(JSON.parse(contactedRaw));
    }
  }, []);

  const handleRemoveContact = (id) => {
    const updated = contactedTutors.filter(t => t.id !== id);
    setContactedTutors(updated);
    localStorage.setItem('contacted_tutors', JSON.stringify(updated));
    toast.success('Removed from contact history.');
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your contact history?')) {
      localStorage.removeItem('contacted_tutors');
      setContactedTutors([]);
      toast.success('Contact history cleared.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-gray-50/50 min-h-screen">

      {/* Welcome Banner */}
      <div className="mb-10 bg-gradient-to-r from-primary-900 to-indigo-950 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-primary-500/20 blur-[50px]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="bg-white/10 text-primary-200 border border-white/10 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Student / Parent Workspace
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome, {user?.email}</h1>
            <p className="text-primary-150 font-light text-sm max-w-xl">
              Track tutors you have previously contacted, manage tutor bookmarks, and read search recommendations guidelines.
            </p>
          </div>

          <Link
            to="/"
            className="flex items-center space-x-2 bg-white text-primary-950 hover:bg-primary-50 transition-colors font-bold px-6 py-3.5 rounded-xl shadow-md self-start md:self-center text-sm"
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-primary-600" />
            <span>Search Tutors</span>
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-8 space-x-8">
        <button
          onClick={() => setActiveTab('contacts')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'contacts'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          Contact History ({contactedTutors.length})
        </button>
        <button
          onClick={() => setActiveTab('safety')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'safety'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          Safety & Vetting Guide
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'contacts' && (
        <div className="space-y-6">
          {contactedTutors.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 p-8"
            >
              <PhoneIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">No contacted tutors</h3>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Tutors whose phone numbers you reveal will automatically appear here so you can keep track of your outreach.
              </p>
              <Link to="/" className="inline-block mt-6 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm text-sm">
                Explore Vetted Tutors
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Contact Log</h2>
                <button
                  onClick={clearHistory}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 border border-red-150 hover:bg-red-50/50 transition-colors px-3 py-1.5 rounded-lg"
                >
                  Clear All History
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactedTutors.map((tutor) => (
                  <motion.div
                    layout
                    key={tutor.id}
                    className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-inner font-bold">
                            {tutor.fullName ? tutor.fullName.charAt(0).toUpperCase() : 'T'}
                          </div>
                          <div>
                            <Link to={`/tutors/${tutor.id}`} className="font-bold text-gray-900 hover:text-primary-600 transition-colors text-base leading-tight">
                              {tutor.fullName}
                            </Link>
                            <div className="flex items-center text-gray-500 text-xs font-semibold mt-1">
                              <MapPinIcon className="h-3.5 w-3.5 mr-0.5 text-primary-500" />
                              <span>{tutor.location || 'Remote'}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveContact(tutor.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove from history"
                        >
                          <TrashIcon className="h-4.5 w-4.5" />
                        </button>
                      </div>

                      {/* Contact Info Details */}
                      <div className="mt-5 space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
                        <div className="flex items-center text-gray-750">
                          <PhoneIcon className="h-4 w-4 mr-2 text-primary-500" />
                          <span className="font-bold text-gray-900">{tutor.phoneNumber}</span>
                        </div>
                        <div className="flex items-center text-gray-650 truncate">
                          <EnvelopeIcon className="h-4 w-4 mr-2 text-indigo-500" />
                          <span>{tutor.email || 'No email shared'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Subjects pills */}
                    {tutor.subjects && tutor.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-5">
                        {tutor.subjects.map((s) => (
                          <span
                            key={s.id}
                            className="px-2.5 py-0.5 bg-primary-50 text-primary-800 rounded-lg text-xs font-bold border border-primary-100"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'safety' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-8 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <ShieldCheckIcon className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Safety & Vetting Guidelines for Parents</h2>
              <p className="text-sm text-gray-500 mt-1">Make informed decisions when selecting study partners and professional mentors.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t">
            {/* Vetting steps */}
            <div className="space-y-5">
              <h3 className="text-md font-bold text-gray-900 flex items-center">
                <BookOpenIcon className="h-5 w-5 mr-2 text-primary-600" /> Vetting Checklist
              </h3>

              <div className="space-y-4 text-sm text-gray-650 leading-relaxed">
                <div className="p-4 bg-gray-50 rounded-2xl border">
                  <p className="font-bold text-gray-900 mb-1">1. Conduct a Phone Consultation</p>
                  <p>Call the tutor to discuss qualifications, subjects focus, teaching styles, and hourly rates before booking sessions.</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border">
                  <p className="font-bold text-gray-900 mb-1">2. Interview & Credentials Validation</p>
                  <p>Ask for references, professional background, or relevant academic degrees during the first contact.</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border">
                  <p className="font-bold text-gray-900 mb-1">3. Arrange Safe Workspaces</p>
                  <p>For in-person tutoring, conduct sessions in open public libraries, community centers, or in a supervised home room.</p>
                </div>
              </div>
            </div>

            {/* Platform rules */}
            <div className="space-y-5">
              <h3 className="text-md font-bold text-gray-900 flex items-center">
                <InformationCircleIcon className="h-5 w-5 mr-2 text-indigo-500" /> Platform Disclaimers
              </h3>

              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  <strong>Verification Moderation:</strong> While TutorFinder verifies that tutors are real individuals and checks key details before approval, parents are solely responsible for checking references and academic documents.
                </p>
                <p>
                  <strong>No Payment Processing:</strong> TutorFinder is a directory connection platform. Payments and scheduling are managed directly between you and the educator, and the platform takes 0% commission.
                </p>
                <p className="p-4 bg-amber-50 text-amber-800 rounded-2xl border border-amber-250 font-medium">
                  Report suspicious profiles or broken phone logs immediately to support@tutorfinder.com to trigger admin review and possible listing suspension.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default ParentDashboard;
