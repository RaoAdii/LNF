import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/api';
import PageWrapper from '../components/PageWrapper';
import { AuthContext } from '../context/AuthContext';
import BrandLogo from '@components/BrandLogo';

const validationSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
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

        login(response.data.token, response.data.user);
        toast.success(response.data?.message || 'Account created successfully.');
        navigate('/home', { replace: true });
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
            <h1 className="text-[1.75rem] leading-tight font-syne font-bold mb-1 text-ink-primary">
              Create Account
            </h1>
            <p className="text-sm text-ink-secondary font-dm font-light">Join Lost & Found Hub today</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4 mb-6">
            <div className="input-wrapper">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder={focused.name || formik.values.name ? 'John Doe' : ''}
                  className="input"
                  {...formik.getFieldProps('name')}
                  onFocus={() => setFocused((prev) => ({ ...prev, name: true }))}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    setFocused((prev) => ({ ...prev, name: false }));
                  }}
                />
                <label className="input-label">Full Name</label>
              </div>
              {formik.touched.name && formik.errors.name && <p className="text-lost-color text-xs mt-1">{formik.errors.name}</p>}
            </div>

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
              {formik.touched.email && formik.errors.email && <p className="text-lost-color text-xs mt-1">{formik.errors.email}</p>}
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
              {formik.values.password && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 4) * 100}%`, transition: 'width 180ms ease' }}
                    />
                  </div>
                  <span className="text-xs font-dm font-medium text-ink-muted">{getStrengthText()}</span>
                </div>
              )}
              {formik.touched.password && formik.errors.password && (
                <p className="text-lost-color text-xs mt-2">{formik.errors.password}</p>
              )}
            </div>

            <div className="input-wrapper">
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder={focused.confirmPassword || formik.values.confirmPassword ? '********' : ''}
                  className="input pr-10 py-3"
                  {...formik.getFieldProps('confirmPassword')}
                  onFocus={() => setFocused((prev) => ({ ...prev, confirmPassword: true }))}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    setFocused((prev) => ({ ...prev, confirmPassword: false }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ink-muted hover:text-accent transition-colors"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <label className="input-label">Confirm Password</label>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-lost-color text-xs mt-2">{formik.errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full btn btn-primary mt-6 ${isLoading ? 'btn-loading' : ''}`}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
          </div>

          <p className="text-center text-sm text-ink-secondary font-dm">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-medium hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Register;
