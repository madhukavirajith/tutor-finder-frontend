import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, AcademicCapIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline';

const TutorCard = ({ tutor }) => {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <Link to={`/tutors/${tutor.id}`} className="block h-full">
        {/* Top Gradient Accent Banner */}
        <div className="h-2 w-full bg-gradient-to-r from-primary-500 to-indigo-500" />
        
        <div className="p-6 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {/* Profile Image/Avatar */}
              <div className="w-16 h-16 rounded-full border-2 border-gray-50 flex-shrink-0 bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-inner overflow-hidden">
                {tutor.profileImageUrl ? (
                  <img src={tutor.profileImageUrl} alt={tutor.fullName} className="w-full h-full object-cover" />
                ) : (
                  <AcademicCapIcon className="h-8 w-8 text-white/90" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight">
                  {tutor.fullName}
                </h3>
                <div className="flex items-center text-gray-500 text-xs font-semibold mt-1 bg-gray-100/70 py-0.5 px-2.5 rounded-full w-fit">
                  <MapPinIcon className="h-3.5 w-3.5 mr-1 text-primary-500" />
                  <span>{tutor.location || 'Remote'}</span>
                </div>
              </div>
            </div>
            
            {/* Corner visual arrow button */}
            <div className="p-1.5 rounded-lg bg-gray-50 group-hover:bg-primary-50 group-hover:text-primary-600 text-gray-400 transition-colors">
              <ArrowUpRightIcon className="h-4 w-4" />
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {tutor.bio || 'Professional and passionate educator dedicated to helping students unlock their maximum academic potential.'}
          </p>

          {/* Render Subject Pills on the card */}
          {tutor.subjects && tutor.subjects.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {tutor.subjects.slice(0, 3).map(subject => (
                <span 
                  key={subject.id} 
                  className="px-2.5 py-0.5 bg-primary-50 text-primary-800 rounded-lg text-xs font-semibold border border-primary-100"
                >
                  {subject.name}
                </span>
              ))}
              {tutor.subjects.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">
                  +{tutor.subjects.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default TutorCard;