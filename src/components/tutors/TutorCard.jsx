import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const TutorCard = ({ tutor }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/tutors/${tutor.id}`}>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
              <AcademicCapIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{tutor.fullName}</h3>
              <div className="flex items-center text-gray-500 text-sm">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {tutor.location || 'Remote'}
              </div>
            </div>
          </div>
          <p className="mt-4 text-gray-600 text-sm line-clamp-2">
            {tutor.bio || 'Enthusiastic tutor ready to help you learn.'}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default TutorCard;