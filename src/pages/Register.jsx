import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EnvelopeIcon,
  LockClosedIcon,
  AcademicCapIcon,
  UserIcon,
  CheckCircleIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';

// ── Validation Schemas ──────────────────────────────────────────────────────
const parentSchema = z.object({
  role: z.literal('PARENT'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const tutorSchema = z.object({
  role: z.literal('TUTOR'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  title: z.string().min(1, 'Please select a title'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  gender: z.string().min(1, 'Please select a gender'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phoneNumber: z.string().min(7, 'Enter a valid contact number'),
  address: z.string().optional(),
  agreeTerms: z.literal(true, { errorMap: () => ({ message: 'You must agree to the terms' }) }),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const schema = z.discriminatedUnion('role', [parentSchema, tutorSchema]);

// ── Shared Field Wrapper ────────────────────────────────────────────────────
const FieldRow = ({ label, optional, error, children }) => (
  <div className="space-y-1">
    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
      {label}
      {optional && <span className="ml-1 normal-case font-normal text-gray-400">(Optional)</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
  </div>
);

// ── Styled Select ───────────────────────────────────────────────────────────
const StyledSelect = ({ error, children, ...props }) => (
  <select
    className={`w-full px-4 py-2.5 border rounded-xl bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none cursor-pointer ${
      error ? 'border-red-400' : 'border-gray-300'
    }`}
    {...props}
  >
    {children}
  </select>
);

// ── Main Component ──────────────────────────────────────────────────────────
const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('PARENT');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'PARENT' },
  });

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    reset({ role });
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        email: data.email,
        password: data.password,
        role: data.role,
        ...(data.role === 'TUTOR' && {
          title: data.title,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth,
          phoneNumber: data.phoneNumber,
          address: data.address || '',
        }),
      };
      await registerUser(payload);
      navigate('/login');
    } catch (error) {
      // Error handled by toast inside AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-gray-50">
      {/* ── Branding Panel ───────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:col-span-5 relative overflow-hidden bg-gradient-to-tr from-primary-950 via-primary-900 to-indigo-950 text-white flex-col justify-between p-12">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-primary-500/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-indigo-500/20 blur-[100px] pointer-events-none" />

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

        <div className="my-auto z-10 space-y-8 pr-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
              Join the Network of Global Learners.
            </h1>
            <p className="text-lg text-primary-200/90 font-light">
              Create your account today and unlock a personalized directory of expert tutors and student matches.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 pt-4 border-t border-white/10"
          >
            {[
              '100% Certified and Moderated Tutors',
              'AI-Powered Personalized Recommendations',
              'Direct Contact & Subject-Level Focus',
            ].map((feat) => (
              <div key={feat} className="flex items-center space-x-3">
                <CheckCircleIcon className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-gray-200">{feat}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-primary-300/60 z-10"
        >
          © {new Date().getFullYear()} TutorFinder. Premium Mentorship Platform.
        </motion.div>
      </div>

      {/* ── Form Panel ───────────────────────────────────────────────── */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center px-4 sm:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100"
        >
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* ── Role Selector ─────────────────────────────────── */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                I want to join as a...
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'PARENT', label: 'Parent / Student', Icon: UserIcon },
                  { value: 'TUTOR', label: 'Tutor', Icon: AcademicCapIcon },
                ].map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRoleChange(value)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedRole === value
                        ? 'border-primary-500 bg-primary-50 text-primary-950 font-semibold ring-2 ring-primary-500/20'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`h-6 w-6 mb-2 ${selectedRole === value ? 'text-primary-600' : 'text-gray-400'}`} />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
              <input type="hidden" {...register('role')} value={selectedRole} />
            </div>

            {/* ── Shared Credentials ────────────────────────────── */}
            <div className="space-y-4">
              <FieldRow label="Email Address" error={errors.email?.message}>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                  {...register('email')}
                />
              </FieldRow>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldRow label="Password" error={errors.password?.message}>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                    {...register('password')}
                  />
                </FieldRow>
                <FieldRow label="Confirm Password" error={errors.confirmPassword?.message}>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                    {...register('confirmPassword')}
                  />
                </FieldRow>
              </div>
            </div>

            {/* ── Tutor-Only Fields (animated) ─────────────────── */}
            <AnimatePresence>
              {selectedRole === 'TUTOR' && (
                <motion.div
                  key="tutor-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 space-y-4">
                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                        Tutor Information
                      </span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Title + Gender */}
                    <div className="grid grid-cols-2 gap-4">
                      <FieldRow label="Title" error={errors.title?.message}>
                        <StyledSelect error={errors.title?.message} {...register('title')}>
                          <option value="">Select Title</option>
                          {['Mr', 'Mrs', 'Miss', 'Ms', 'Dr', 'Prof'].map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </StyledSelect>
                      </FieldRow>

                      <FieldRow label="Gender" error={errors.gender?.message}>
                        <StyledSelect error={errors.gender?.message} {...register('gender')}>
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </StyledSelect>
                      </FieldRow>
                    </div>

                    {/* First + Last Name */}
                    <div className="grid grid-cols-2 gap-4">
                      <FieldRow label="First Name" error={errors.firstName?.message}>
                        <Input
                          type="text"
                          placeholder="Amara"
                          icon={<IdentificationIcon className="h-5 w-5 text-gray-400" />}
                          {...register('firstName')}
                        />
                      </FieldRow>
                      <FieldRow label="Last Name" error={errors.lastName?.message}>
                        <Input
                          type="text"
                          placeholder="Perera"
                          icon={<IdentificationIcon className="h-5 w-5 text-gray-400" />}
                          {...register('lastName')}
                        />
                      </FieldRow>
                    </div>

                    {/* Date of Birth */}
                    <FieldRow label="Date of Birth" error={errors.dateOfBirth?.message}>
                      <Input
                        type="date"
                        icon={<CalendarIcon className="h-5 w-5 text-gray-400" />}
                        {...register('dateOfBirth')}
                      />
                    </FieldRow>

                    {/* Contact Number */}
                    <FieldRow label="Contact Number" error={errors.phoneNumber?.message}>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-sm font-medium select-none">
                          +94
                        </span>
                        <input
                          type="tel"
                          placeholder="077 123 4567"
                          className={`flex-1 px-4 py-2.5 border rounded-r-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                            errors.phoneNumber ? 'border-red-400' : 'border-gray-300'
                          }`}
                          {...register('phoneNumber')}
                        />
                      </div>
                    </FieldRow>

                    {/* Address */}
                    <FieldRow label="Address" optional error={errors.address?.message}>
                      <div className="relative">
                        <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <textarea
                          rows={3}
                          placeholder="No. 45, Galle Road, Colombo 03"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                            errors.address ? 'border-red-400' : 'border-gray-300'
                          }`}
                          {...register('address')}
                        />
                      </div>
                    </FieldRow>

                    {/* Terms & Conditions */}
                    <div className="flex items-start gap-3 pt-1">
                      <input
                        id="agreeTerms"
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        {...register('agreeTerms')}
                      />
                      <label htmlFor="agreeTerms" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                        I agree to the{' '}
                        <span className="font-semibold text-primary-600 hover:underline cursor-pointer">
                          Terms of Use and Privacy Policy
                        </span>{' '}
                        of TutorFinder. I confirm that the information provided is accurate.
                      </label>
                    </div>
                    {errors.agreeTerms && (
                      <p className="text-xs text-red-500">{errors.agreeTerms?.message}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Submit Button ─────────────────────────────────── */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-primary-500/10 hover:shadow-lg hover:shadow-primary-500/20 active:scale-[0.99] transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Sign Up</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;