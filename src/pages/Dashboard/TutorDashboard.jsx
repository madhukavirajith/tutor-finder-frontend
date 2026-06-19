import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  UserIcon, 
  PhoneIcon, 
  MapPinIcon, 
  BookOpenIcon, 
  DocumentTextIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { getSubjects, getOwnProfile, updateOwnProfile, createSubject } from '../../services/tutors';
import Loader from '../../components/common/Loader';

const TutorDashboard = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    phoneNumber: '',
    location: '',
    bio: '',
    subjects: [],
    profileImageUrl: '',
    bannerImageUrl: ''
  });
  const [subjectsList, setSubjectsList] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [status, setStatus] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [customSubject, setCustomSubject] = useState('');
  const [addingSubject, setAddingSubject] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch all available subjects
        const subjectsRes = await getSubjects();
        setSubjectsList(subjectsRes.data);

        // Fetch tutor's own profile
        const profileRes = await getOwnProfile();
        const data = profileRes.data;
        
        setProfile({
          fullName: data.fullName || '',
          phoneNumber: data.phoneNumber || '',
          location: data.location || '',
          bio: data.bio || '',
          subjects: data.subjects || [],
          profileImageUrl: data.profileImageUrl || '',
          bannerImageUrl: data.bannerImageUrl || ''
        });
        setStatus(data.approvalStatus || 'PENDING');
        setSelectedSubjectIds((data.subjects || []).map(sub => sub.id));
      } catch (err) {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjectIds(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleAddCustomSubject = async (e) => {
    e.preventDefault();
    if (!customSubject.trim()) return;
    setAddingSubject(true);
    try {
      const res = await createSubject(customSubject.trim());
      const newSub = res.data;
      setSubjectsList(prev => {
        if (prev.some(s => s.id === newSub.id)) return prev;
        return [...prev, newSub];
      });
      setSelectedSubjectIds(prev => 
        prev.includes(newSub.id) ? prev : [...prev, newSub.id]
      );
      setCustomSubject('');
      toast.success(`Subject "${newSub.name}" added successfully!`);
    } catch (err) {
      toast.error('Failed to add custom subject');
    } finally {
      setAddingSubject(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateOwnProfile({
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
        location: profile.location,
        bio: profile.bio,
        subjectIds: selectedSubjectIds,
        profileImageUrl: profile.profileImageUrl,
        bannerImageUrl: profile.bannerImageUrl
      });
      setStatus(data.approvalStatus);
      toast.success('Profile updated successfully! Awaiting admin review.');
    } catch (err) {
      toast.error('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      {/* Premium Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tutor Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">Customize your professional profile and manage subjects taught.</p>
      </div>

      {/* Verification Status Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {status === 'APPROVED' && (
          <div className="flex items-center p-4 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-800 shadow-sm">
            <CheckCircleIcon className="h-6 w-6 mr-3 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold">Verified & Active</p>
              <p className="text-xs text-emerald-700">Your profile is currently approved and visible to parents and students searching the directory.</p>
            </div>
          </div>
        )}
        {status === 'PENDING' && (
          <div className="flex items-center p-4 rounded-xl border border-amber-100 bg-amber-50 text-amber-800 shadow-sm">
            <ExclamationTriangleIcon className="h-6 w-6 mr-3 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-bold">Awaiting Verification Review</p>
              <p className="text-xs text-amber-700">Your profile edits are submitted. Tutors must undergo moderation checks before being published.</p>
            </div>
          </div>
        )}
        {status === 'REJECTED' && (
          <div className="flex items-center p-4 rounded-xl border border-rose-100 bg-rose-50 text-rose-800 shadow-sm">
            <XCircleIcon className="h-6 w-6 mr-3 text-rose-600 flex-shrink-0" />
            <div>
              <p className="font-bold">Changes Required</p>
              <p className="text-xs text-rose-700">Your profile did not pass verification checks. Please correct details below and save to resubmit.</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Main Settings Form */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
      >
        <div className="px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white flex items-center">
          <UserIcon className="h-5 w-5 mr-2" />
          <h2 className="font-bold text-lg">Edit Tutor Biography & Details</h2>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center">
                <UserIcon className="h-4 w-4 mr-1.5 text-gray-400" /> Full Name
              </label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50"
                value={profile.fullName}
                onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="e.g. Dr. John Smith"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center">
                <PhoneIcon className="h-4 w-4 mr-1.5 text-gray-400" /> Phone Number
              </label>
              <input
                type="tel"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50"
                value={profile.phoneNumber}
                onChange={(e) => setProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="e.g. +94 77 123 4567"
              />
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1.5 text-gray-400" /> Primary Location
              </label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50"
                value={profile.location}
                onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. Colombo, Sri Lanka (or 'Remote')"
              />
            </div>

            {/* Profile Image URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center">
                <PhotoIcon className="h-4 w-4 mr-1.5 text-gray-400" /> Profile Picture URL
              </label>
              <input
                type="url"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50"
                value={profile.profileImageUrl}
                onChange={(e) => setProfile(prev => ({ ...prev, profileImageUrl: e.target.value }))}
                placeholder="e.g. https://imgur.com/your-photo.jpg"
              />
              {profile.profileImageUrl && (
                <div className="mt-2 flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
                  <img 
                    src={profile.profileImageUrl} 
                    alt="Preview" 
                    className="w-12 h-12 object-cover rounded-full border border-gray-300" 
                    onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }} 
                  />
                  <span className="text-xs text-gray-500 font-medium">Profile Image Preview</span>
                </div>
              )}
            </div>

            {/* Banner/Leaflet Image URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center">
                <PhotoIcon className="h-4 w-4 mr-1.5 text-gray-400" /> Leaflet / Flyer Banner URL
              </label>
              <input
                type="url"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50"
                value={profile.bannerImageUrl}
                onChange={(e) => setProfile(prev => ({ ...prev, bannerImageUrl: e.target.value }))}
                placeholder="e.g. https://imgur.com/your-flyer.jpg"
              />
              {profile.bannerImageUrl && (
                <div className="mt-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                  <div className="w-full h-12 overflow-hidden rounded border border-gray-300">
                    <img 
                      src={profile.bannerImageUrl} 
                      alt="Banner Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.target.src = 'https://placehold.co/400x100?text=No+Banner'; }} 
                    />
                  </div>
                  <span className="text-xs text-gray-500 font-medium mt-1 block">Leaflet Banner Preview</span>
                </div>
              )}
            </div>

            {/* Biography */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center">
                <DocumentTextIcon className="h-4 w-4 mr-1.5 text-gray-400" /> Biography (Bio)
              </label>
              <textarea
                rows={5}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50"
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell parents and students about your qualifications, teaching methodology, and experience..."
              />
            </div>

            {/* Subject Checkboxes selector */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center justify-between">
                <span className="flex items-center">
                  <BookOpenIcon className="h-4 w-4 mr-1.5 text-gray-400" /> Subjects You Teach
                </span>
                <span className="text-xs text-gray-400 font-normal">Select from list or add a custom one below</span>
              </label>

              {/* Add Custom Subject Inline Form */}
              <div className="flex gap-2 mb-4 bg-gray-50/30 p-3 rounded-xl border border-gray-200">
                <input
                  type="text"
                  placeholder="Type a new subject name (e.g. Advanced Calculus)"
                  className="flex-1 rounded-lg border border-gray-300 px-3.5 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAddCustomSubject}
                  disabled={addingSubject || !customSubject.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 text-xs"
                >
                  {addingSubject ? 'Adding...' : 'Add Subject'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50/50 p-4 rounded-xl border border-gray-200">
                {subjectsList.map(subject => {
                  const isChecked = selectedSubjectIds.includes(subject.id);
                  return (
                    <label 
                      key={subject.id} 
                      className={`flex items-center p-3 rounded-lg border cursor-pointer select-none transition-all ${
                        isChecked 
                          ? 'border-primary-500 bg-primary-50 text-primary-950 font-medium' 
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2.5"
                        checked={isChecked}
                        onChange={() => handleSubjectToggle(subject.id)}
                      />
                      <span className="text-sm">{subject.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-3 px-8 text-base shadow-md disabled:opacity-50"
            >
              {saving ? 'Saving Changes...' : 'Save Profile Details'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TutorDashboard;