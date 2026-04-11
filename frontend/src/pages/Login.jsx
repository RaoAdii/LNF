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
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);

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
        navigate('/');
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
            <div className="w-12 h-12 bg-accent rounded-lg mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
              L&F
            </div>
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
                placeholder="your@email.com"
                className="input"
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
                  placeholder="••••••••"
                  className="input pr-10"
                  {...formik.getFieldProps('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ink-muted hover:text-accent transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <label className="input-label">Password</label>
              {formik.touched.password && formik.errors.password && (
                <p className="text-lost-color text-xs mt-1">{formik.errors.password}</p>
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
