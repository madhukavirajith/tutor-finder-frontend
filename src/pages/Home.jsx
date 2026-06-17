import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  AcademicCapIcon,
  AdjustmentsHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import {
  getSubjects,
  getTutors,
  getRecommendations,
  getAutocompleteSuggestions,
  checkTypoCorrection as apiCheckTypoCorrection
} from '../services/tutors';
import TutorCard from '../components/tutors/TutorCard';
import Loader from '../components/common/Loader';

const Home = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // New DSA UI states
  const [suggestions, setSuggestions] = useState([]);
  const [correctionSuggestion, setCorrectionSuggestion] = useState('');
  const [sortMode, setSortMode] = useState('DEFAULT'); // 'DEFAULT', 'LOCATION', 'BIO', 'HYBRID'

  const fetchSubjects = useCallback(async () => {
    try {
      const { data } = await getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Failed to fetch subjects');
    }
  }, []);

  const fetchTutors = useCallback(async () => {
    setLoading(true);
    try {
      if (sortMode !== 'DEFAULT') {
        // Use our custom Heap/PriorityQueue dynamic recommendation engine!
        const params = {
          location: location,
          subject: subject,
          bioKeyword: searchTerm,
          mode: sortMode,
          limit: 9
        };
        const { data } = await getRecommendations(params);
        setTutors(data);
        setTotalPages(1); // Recommendations returned as a sorted list
      } else {
        const params = { page, size: 9 };
        if (searchTerm) params.search = searchTerm;
        if (location) params.location = location;
        if (subject) params.subject = subject;
        const { data } = await getTutors(params);
        setTutors(data.content);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch tutors');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, location, subject, sortMode]);

  // Fetch Trie Autocomplete Suggestions in Real Time
  useEffect(() => {
    const getSuggestions = async () => {
      if (searchTerm.trim().length > 1) {
        try {
          const { data } = await getAutocompleteSuggestions(searchTerm);
          setSuggestions(data);
        } catch (e) {
          console.error(e);
        }
      } else {
        setSuggestions([]);
      }
    };
    getSuggestions();
  }, [searchTerm]);

  // Check Typo Correction (Levenshtein Distance)
  const checkTypoCorrection = async (term) => {
    if (!term || term.trim() === '') return;
    try {
      const { data } = await apiCheckTypoCorrection(term);
      if (data.corrected) {
        setCorrectionSuggestion(data.suggestion);
      } else {
        setCorrectionSuggestion('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchTutors();
  }, [fetchSubjects, fetchTutors]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    checkTypoCorrection(searchTerm);
    fetchTutors();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">

      {/* Premium Hero Section with mesh gradient & grid lines background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-indigo-950 text-white py-20 px-4">
        {/* Background Grid Pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />

        {/* Decorative Blurred Blobs */}
        <div className="absolute top-1/4 left-1/10 w-72 h-72 rounded-full bg-primary-500/10 blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/10 w-80 h-80 rounded-full bg-indigo-500/10 blur-[80px]" />

        <div className="relative max-w-5xl mx-auto text-center z-10 space-y-6">


          <motion.h1
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight"
          >
            Find Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-300">Tutor</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-primary-250/90 font-light max-w-2xl mx-auto"
          >
            Connect with vetted local and remote educators customized to your learning preferences and subjects.
          </motion.p>

          {/* Glassmorphic Search Form container */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-md border border-gray-200/80 p-3 rounded-2xl shadow-2xl flex flex-col lg:flex-row gap-3 max-w-4xl mx-auto mt-10"
          >
            {/* Search inputs */}
            <div className="flex-1 min-w-[240px] flex flex-col relative h-12">
              <div className="flex items-center border border-gray-200 hover:border-primary-400 focus-within:border-primary-500 rounded-xl px-3 bg-gray-50/50 transition-colors h-full">
                <MagnifyingGlassIcon className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search name or keywords..."
                  className="w-full h-full bg-transparent focus:outline-none text-gray-800 text-sm placeholder-gray-400 font-medium py-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Trie Autocomplete Suggestions box */}
              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-150 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto text-left text-gray-750 divide-y divide-gray-50"
                >
                  {suggestions.map((sug, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-3 hover:bg-primary-50 hover:text-primary-950 cursor-pointer text-sm font-medium transition-colors"
                      onClick={() => {
                        setSearchTerm(sug);
                        setSuggestions([]);
                        setPage(0);
                        checkTypoCorrection(sug);
                      }}
                    >
                      {sug.charAt(0).toUpperCase() + sug.slice(1)}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Location input */}
            <div className="flex items-center border border-gray-200 hover:border-primary-400 focus-within:border-primary-500 rounded-xl px-3 bg-gray-50/50 transition-colors lg:w-48 h-12">
              <MapPinIcon className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Location"
                className="w-full h-full bg-transparent focus:outline-none text-gray-800 text-sm placeholder-gray-400 font-medium py-0"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Subject Selector */}
            <div className="relative h-12 lg:w-44">
              <select
                className="w-full h-full pl-3 pr-8 border border-gray-200 hover:border-primary-400 focus:border-primary-500 rounded-xl bg-gray-50/50 text-gray-700 text-sm font-medium focus:outline-none cursor-pointer transition-colors appearance-none"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.name}>{sub.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            {/* Max-Heap Recommendation Sort Mode selector */}
            <div className="relative h-12 lg:w-56">
              <div className="flex items-center border border-gray-200 hover:border-primary-400 focus-within:border-primary-500 rounded-xl px-3 bg-gray-50/50 transition-colors h-full">
                <AdjustmentsHorizontalIcon className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" />
                <select
                  className="bg-transparent text-gray-700 text-sm font-medium focus:outline-none cursor-pointer w-full h-full pr-6 appearance-none"
                  value={sortMode}
                  onChange={(e) => {
                    setSortMode(e.target.value);
                    setPage(0);
                  }}
                >
                  <option value="DEFAULT">Default Sort</option>
                  <option value="LOCATION">Sort: Location match</option>
                  <option value="BIO">Sort: Bio relevance</option>
                  <option value="HYBRID">Sort: Smart recommendation</option>
                </select>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            <button type="submit" className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold h-12 px-8 rounded-xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all whitespace-nowrap text-sm flex items-center justify-center">
              Search Tutors
            </button>
          </motion.form>

          {/* Typo Correction Prompt (Levenshtein Distance) */}
          {correctionSuggestion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 mt-4 text-sm text-amber-200 bg-amber-500/10 border border-amber-500/20 py-2 px-4 rounded-xl"
            >
              <span>Did you mean:</span>
              <span
                className="font-bold underline cursor-pointer hover:text-white transition-colors"
                onClick={() => {
                  setSearchTerm(correctionSuggestion);
                  setCorrectionSuggestion('');
                  setPage(0);
                  setSortMode('HYBRID'); // automatically trigger recommendation matching
                }}
              >
                {correctionSuggestion.charAt(0).toUpperCase() + correctionSuggestion.slice(1)}
              </span>
              <span>?</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Tutor Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Available Educators</h2>
            <p className="text-sm text-gray-500 mt-1">Showing search results for selected matching criteria</p>
          </div>
          <div className="mt-4 sm:mt-0 text-sm font-semibold text-gray-500">
            {tutors.length} {tutors.length === 1 ? 'tutor' : 'tutors'} listed
          </div>
        </div>

        {loading ? (
          <div className="py-20">
            <Loader />
          </div>
        ) : (
          <>
            {tutors.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <AcademicCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">No tutors found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters, query terms, or changing sorting mode.</p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {tutors.map(tutor => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </motion.div>
            )}

            {/* Upgraded Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-4 border-t pt-8">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="flex items-center space-x-1.5 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50/80 px-4 py-2 border rounded-lg text-sm font-semibold text-gray-700"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <span className="text-sm font-semibold text-gray-700">
                  Page {page + 1} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="flex items-center space-x-1.5 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50/80 px-4 py-2 border rounded-lg text-sm font-semibold text-gray-700"
                >
                  <span>Next</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;