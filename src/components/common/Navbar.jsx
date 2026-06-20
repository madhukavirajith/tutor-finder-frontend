import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon, ChevronDownIcon, ArrowRightOnRectangleIcon, UserIcon, AcademicCapIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (user?.role === 'TUTOR') return '/dashboard/tutor';
    if (user?.role === 'ADMIN') return '/dashboard/admin?tab=overview';
    if (user?.role === 'PARENT') return '/dashboard/parent';
    return '/';
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <AcademicCapIcon className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-xl text-gray-900">TutorFinder</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <UserCircleIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <span className="hidden md:flex items-center gap-1.5 font-medium">
                    {user.email}
                    <span className="text-[10px] tracking-wider uppercase font-extrabold px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 border border-primary-200">
                      {user.role}
                    </span>
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {/* User Info Header */}
                      <div className="px-4 py-2 border-b border-gray-150 bg-gray-50/50">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Logged in as</p>
                        <p className="text-xs font-bold text-gray-700 mt-0.5 capitalize">{user.role.toLowerCase()}</p>
                      </div>

                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={getDashboardLink()}
                            className={`${active ? 'bg-gray-100' : ''} flex items-center px-4 py-2 text-sm text-gray-700`}
                          >
                            <UserIcon className="h-4 w-4 mr-2" />
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                      {user.role === 'ADMIN' && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard/admin?tab=approvals"
                              className={`${active ? 'bg-gray-100' : ''} flex items-center px-4 py-2 text-sm text-gray-700`}
                            >
                              <ShieldCheckIcon className="h-4 w-4 mr-2" />
                              Approvals
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${active ? 'bg-gray-100' : ''} flex w-full items-center px-4 py-2 text-sm text-red-600`}
                          >
                            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn-secondary">Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;