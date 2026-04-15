import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} TutorFinder. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;