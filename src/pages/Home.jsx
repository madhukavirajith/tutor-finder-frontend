import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, MapPinIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
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

  useEffect(() => {
    fetchSubjects();
    fetchTutors();
  }, [page, searchTerm, location, subject]);

  const fetchSubjects = async () => {
    try {
      const { data } = await api.get('/public/subjects');
      setSubjects(data);
    } catch (error) {
      console.error('Failed to fetch subjects');
    }
  };

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const params = { page, size: 9 };
      if (searchTerm) params.search = searchTerm;
      if (location) params.location = location;
      if (subject) params.subject = subject;
      const { data } = await api.get('/public/tutors', { params });
      setTutors(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch tutors');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Find Your Perfect Tutor
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-primary-100 mb-8"
          >
            Connect with expert tutors in your area and start learning today
          </motion.p>
          
          {/* Search Form */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="bg-white p-2 rounded-lg shadow-lg flex flex-col md:flex-row gap-2"
          >
            <div className="flex-1 flex items-center border rounded-lg px-3 bg-gray-50">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or subject..."
                className="w-full py-3 px-3 bg-transparent focus:outline-none text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center border rounded-lg px-3 bg-gray-50">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                className="w-full py-3 px-3 bg-transparent focus:outline-none text-gray-700"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <select
              className="py-3 px-3 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.name}>{sub.name}</option>
              ))}
            </select>
            <button type="submit" className="btn-primary py-3 px-6 whitespace-nowrap">
              Search
            </button>
          </motion.form>
        </div>
      </div>

      {/* Tutor Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <Loader />
        ) : (
          <>
            {tutors.length === 0 ? (
              <div className="text-center py-12">
                <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900">No tutors found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search filters</p>
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {tutors.map(tutor => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </motion.div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 space-x-2">
                <button 
                  onClick={() => setPage(p => Math.max(0, p-1))}
                  disabled={page === 0}
                  className="btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Page {page+1} of {totalPages}
                </span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages-1, p+1))}
                  disabled={page === totalPages-1}
                  className="btn-secondary disabled:opacity-50"
                >
                  Next
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