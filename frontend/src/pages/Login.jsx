import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import PageWrapper from '../components/PageWrapper';
import BrandLogo from '@components/BrandLogo';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [focused, setFocused] = useState({});

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
        login(response.data.token, response.data.user);
        toast.success('Login successful!');
        navigate('/home', { replace: true });
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
      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 bg-[radial-gradient(circle_at_12%_10%,#191433_0%,#0e0c1d_45%,#090814_100%)]">
        <div
          className="card card-glass relative z-10 w-full max-w-md shadow-lg border"
          style={hasError ? { animation: 'shake 0.4s ease-in-out' } : {}}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <BrandLogo
                to="/home"
                iconFill="#f7f8ff"
                textColor="#f3f5ff"
                subtitleColor="rgba(195, 205, 255, 0.72)"
              />
            </div>
            <h1 className="text-[1.8rem] leading-tight font-syne font-bold mb-1 text-ink-primary">
              Welcome Back
            </h1>
            <p className="text-sm text-ink-secondary font-dm font-light">Sign in to continue to Lost & Found</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4 mb-6">
            <div className="input-wrapper">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder={focused.email || formik.values.email ? 'your@email.com' : ''}
                  className="input"
                  {...formik.getFieldProps('email')}
                  onFocus={() => setFocused((prev) => ({ ...prev, email: true }))}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    setFocused((prev) => ({ ...prev, email: false }));
                  }}
                />
                <label className="input-label">Email Address</label>
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-lost-color text-xs mt-1">{formik.errors.email}</p>
              )}
            </div>

            <div className="input-wrapper">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder={focused.password || formik.values.password ? '********' : ''}
                  className="input pr-10 py-3"
                  {...formik.getFieldProps('password')}
                  onFocus={() => setFocused((prev) => ({ ...prev, password: true }))}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    setFocused((prev) => ({ ...prev, password: false }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ink-muted hover:text-accent transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <label className="input-label">Password</label>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-lost-color text-xs mt-2">{formik.errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full btn btn-primary mt-6 ${isLoading ? 'btn-loading' : ''}`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
          </div>

          <p className="text-center text-sm text-ink-secondary font-dm">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent font-medium hover:underline transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Login;
