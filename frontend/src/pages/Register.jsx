import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PageWrapper from '../components/PageWrapper';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const getPasswordStrength = (password) => {
  if (!password) return 0;
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;
  return strength;
};

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [focused, setFocused] = useState({});

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setHasError(false);
      try {
        const response = await authAPI.register({
          name: values.name,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });

        login(response.data.user, response.data.token);
        toast.success('Registration successful!');
        navigate('/');
      } catch (error) {
        setHasError(true);
        toast.error(error.response?.data?.message || 'Registration failed');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const passwordStrength = getPasswordStrength(formik.values.password);

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-lost-color';
    if (passwordStrength <= 2) return 'bg-amber-500';
    return 'bg-found-color';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 2) return 'Fair';
    return 'Strong';
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <motion.div
          className="card card-glass w-full max-w-md shadow-lg border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={hasError ? { animation: 'shake 0.4s ease-in-out' } : {}}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <svg width="44" height="44" viewBox="0 0 44 44" 
                 xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
              
              {/* Badge */}
              <rect width="44" height="44" rx="10" fill="#ffffff"/>
              
              {/* Magnifying glass circle */}
              <circle cx="16" cy="18" r="6" fill="none" stroke="#0f0f12" 
                      strokeWidth="2.2" strokeLinecap="round"/>
              
              {/* Magnifying glass handle */}
              <line x1="21" y1="23" x2="26" y2="28" stroke="#0f0f12" 
                    strokeWidth="2.2" strokeLinecap="round"/>
              
              {/* Ghost diagonal line */}
              <line x1="26" y1="12" x2="32" y2="34" stroke="#0f0f12" 
                    strokeWidth="1.5" strokeLinecap="round" opacity="0.15"/>
              
              {/* F letter */}
              <text x="28" y="33" fontFamily="Arial" fontWeight="900" 
                    fontSize="11" fill="#0f0f12">F</text>
              
            </svg>
            <h1 className="text-2xl font-syne font-bold text-ink-primary mb-2">
              Create Account
            </h1>
            <p className="text-sm text-ink-secondary font-dm font-light">
              Join Lost & Found Hub today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-4 mb-6">
            {/* Name */}
            <div className="input-wrapper">
              <input
                type="text"
                name="name"
                placeholder={focused.name || formik.values.name ? "John Doe" : ""}
                className="input"
                onFocus={() => setFocused(prev => ({ ...prev, name: true }))}
                onBlur={() => setFocused(prev => ({ ...prev, name: false }))}
                {...formik.getFieldProps('name')}
              />
              <label className="input-label">Full Name</label>
              {formik.touched.name && formik.errors.name && (
                <p className="text-lost-color text-xs mt-1">{formik.errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                placeholder={focused.email || formik.values.email ? "your@email.com" : ""}
                className="input"
                onFocus={() => setFocused(prev => ({ ...prev, email: true }))}
                onBlur={() => setFocused(prev => ({ ...prev, email: false }))}
                {...formik.getFieldProps('email')}
              />
              <label className="input-label">Email Address</label>
              {formik.touched.email && formik.errors.email && (
                <p className="text-lost-color text-xs mt-1">{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="input-wrapper">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder={focused.password || formik.values.password ? "••••••••" : ""}
                  className="input pr-10 py-3"
                  onFocus={() => setFocused(prev => ({ ...prev, password: true }))}
                  onBlur={() => setFocused(prev => ({ ...prev, password: false }))}
                  {...formik.getFieldProps('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ink-muted hover:text-accent transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
                <label className="input-label">Password</label>
              </div>
              {formik.values.password && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${getStrengthColor()}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(passwordStrength / 4) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-xs font-dm font-medium text-ink-muted">
                    {getStrengthText()}
                  </span>
                </div>
              )}
              {formik.touched.password && formik.errors.password && (
                <p className="text-lost-color text-xs mt-2">{formik.errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="input-wrapper">
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder={focused.confirmPassword || formik.values.confirmPassword ? "••••••••" : ""}
                  className="input pr-10 py-3"
                  onFocus={() => setFocused(prev => ({ ...prev, confirmPassword: true }))}
                  onBlur={() => setFocused(prev => ({ ...prev, confirmPassword: false }))}
                  {...formik.getFieldProps('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ink-muted hover:text-accent transition-colors"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
                <label className="input-label">Confirm Password</label>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-lost-color text-xs mt-2">{formik.errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`w-full btn btn-primary mt-6 ${isLoading ? 'btn-loading' : ''}`}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-ink-secondary font-dm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-accent font-medium hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Register;
