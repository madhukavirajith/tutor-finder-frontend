import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { EnvelopeIcon, LockClosedIcon, AcademicCapIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-gray-50/50">
      {/* Decorative Branding Panel (Desktop Only) */}
      <div className="hidden lg:flex lg:col-span-5 relative overflow-hidden bg-gradient-to-tr from-primary-950 via-primary-900 to-indigo-950 text-white flex-col justify-between p-12">
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-primary-500/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-indigo-500/20 blur-[100px] pointer-events-none" />

        {/* Top Branding Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-3 z-10"
        >
          <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <AcademicCapIcon className="h-7 w-7 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight">TutorFinder</span>
        </motion.div>

        {/* Main Marketing/Vision Text */}
        <div className="my-auto z-10 space-y-8 pr-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
              Unlock Your Potential. Learn from the Best.
            </h1>
            <p className="text-lg text-primary-200/90 font-light">
              Connect with top-tier verified educators customized to your learning speed and academic goals.
            </p>
          </motion.div>

          {/* Core Features list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 pt-4 border-t border-white/10"
          >
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              <span className="text-sm text-gray-200">100% Certified and Moderated Tutors</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              <span className="text-sm text-gray-200">AI-Powered Personalized Recommendations</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              <span className="text-sm text-gray-200">Direct Contact & Subject-Level Focus</span>
            </div>
          </motion.div>
        </div>

        {/* Footer info in Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-primary-300/60 z-10"
        >
          © {new Date().getFullYear()} TutorFinder. Premium Mentorship Platform.
        </motion.div>
      </div>

      {/* Main Login Form Panel */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center px-4 sm:px-8 py-12 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-gray-150/40 border border-gray-100"
        >
          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              New to TutorFinder?{' '}
              <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                Create a new account
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div className="space-y-1">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                  error={errors.email?.message}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all pl-10 border-gray-300 bg-gray-50/30"
                  {...register('email')}
                />
              </div>

              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                  error={errors.password?.message}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all pl-10 border-gray-300 bg-gray-50/30"
                  {...register('password')}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-primary-500/10 hover:shadow-lg hover:shadow-primary-500/20 active:scale-[0.99] transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;