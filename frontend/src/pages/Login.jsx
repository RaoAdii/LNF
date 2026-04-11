import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PageWrapper from '../components/PageWrapper';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [focused, setFocused] = useState({});

  const from = location.state?.from?.pathname || '/';

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setHasError(false);
      try {
        const response = await authAPI.login(values);
        login(response.data.user, response.data.token);
        toast.success('Login successful!');
        navigate(from, { replace: true });
      } catch (error) {
        setHasError(true);
        toast.error(error.response?.data?.message || 'Login failed');
      } finally {
        setIsLoading(false);
      }
    },
  });

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
              Welcome Back
            </h1>
            <p className="text-sm text-ink-secondary font-dm font-light">
              Sign in to continue to Lost & Found
            </p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-4 mb-6">
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
              {formik.touched.password && formik.errors.password && (
                <p className="text-lost-color text-xs mt-2">{formik.errors.password}</p>
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
              {isLoading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-ink-secondary font-dm">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-accent font-medium hover:underline transition-colors"
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Login;
