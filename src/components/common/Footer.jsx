import React from 'react';
import { Link } from 'react-router-dom';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-900 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-gray-900">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <AcademicCapIcon className="h-8 w-8 text-primary-500" />
              <span className="font-bold text-xl tracking-tight">TutorFinder</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Empowering learners by bridging the gap between students and certified, professional educators for customized local and remote mentorship.
            </p>
          </div>

          {/* Quick Links Column - For Students */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">For Students</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">Find Tutors</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">Browse Subjects</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary-400 transition-colors">Student Login</Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Column - For Tutors */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">For Tutors</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/register" className="hover:text-primary-400 transition-colors">Apply to Teach</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary-400 transition-colors">Tutor Dashboard</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">Success Stories</Link>
              </li>
            </ul>
          </div>

          {/* Platform Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Contact & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-gray-500">Support:</span>{' '}
                <a href="mailto:support@tutorfinder.com" className="hover:text-primary-400 transition-colors">support@tutorfinder.com</a>
              </li>
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs text-gray-650">
          <p className="text-gray-600 mb-4 sm:mb-0">
            © {new Date().getFullYear()} TutorFinder. All rights reserved. Built with excellence.
          </p>
          
          {/* Social Icons Placeholder */}
          <div className="flex space-x-5 text-gray-500">
            <a href="#" className="hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;