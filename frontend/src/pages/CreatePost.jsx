import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { AlertTriangle, CheckCircle2, ImageIcon, X } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import FloatingLabelInput from '../components/FloatingLabelInput';
import { postAPI } from '../services/api';

const categories = ['Keys', 'Wallet', 'Pet', 'Phone', 'Documents', 'Other'];

const validationSchema = Yup.object().shape({
  type: Yup.string()
    .oneOf(['lost', 'found'])
    .required('Type is required'),
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .required('Title is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
  location: Yup.string()
    .required('Location is required'),
  category: Yup.string()
    .oneOf(categories)
    .required('Category is required'),
});

const CreatePost = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);

  const formik = useFormik({
    initialValues: {
      type: '',
      title: '',
      description: '',
      location: '',
      category: '',
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!values.image) {
        toast.error('Please select an image');
        return;
      }

      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('type', values.type);
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('location', values.location);
        formData.append('category', values.category);
        formData.append('image', values.image);

        await postAPI.createPost(formData);
        toast.success('Post created successfully!');
        navigate('/my-posts');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to create post');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files[0];
    if (file) {
      validateAndSetImage(file);
    }
  };

  const validateAndSetImage = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    formik.setFieldValue('image', file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    formik.setFieldValue('image', null);
    setImagePreview(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    handleImageChange(e);
  };

  return (
    <PageWrapper>
      <div className="container-md px-6 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl font-syne font-bold text-ink-primary mb-2">
            Post an Item
          </h1>
          <p className="text-ink-secondary font-dm font-light">
            Share details about a lost or found item
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="card card-glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <form onSubmit={formik.handleSubmit} className="space-y-8">
            {/* Type Selector */}
            <div>
              <label className="text-sm font-dm font-medium text-ink-secondary mb-4 block">
                What are you posting? *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'lost', icon: <AlertTriangle size={28} />, label: 'I Lost Something' },
                  { value: 'found', icon: <CheckCircle2 size={28} />, label: 'I Found Something' },
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => formik.setFieldValue('type', option.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formik.values.type === option.value
                        ? 'border-accent bg-accent-soft'
                        : 'border-border hover:border-ink-muted'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-3xl mb-2 flex items-center justify-center">{option.icon}</div>
                    <div className="font-syne font-bold text-ink-primary">
                      {option.label}
                    </div>
                  </motion.button>
                ))}
              </div>
              {formik.touched.type && formik.errors.type && (
                <p className="text-lost-color text-sm mt-2">{formik.errors.type}</p>
              )}
            </div>

            {/* Category Selector */}
            <div>
              <label className="text-sm font-dm font-medium text-ink-secondary mb-4 block">
                Category *
              </label>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <motion.button
                    key={cat}
                    type="button"
                    onClick={() => formik.setFieldValue('category', cat)}
                    className={`px-4 py-2 rounded-full border transition-all font-dm text-sm ${
                      formik.values.category === cat
                        ? 'bg-accent text-white border-accent'
                        : 'border-border text-ink-muted hover:border-ink-secondary'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
              {formik.touched.category && formik.errors.category && (
                <p className="text-lost-color text-sm mt-2">{formik.errors.category}</p>
              )}
            </div>

            {/* Title */}
            <FloatingLabelInput
              label="Title"
              placeholder="e.g., Lost Black Wallet"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="title"
              error={formik.touched.title && formik.errors.title ? formik.errors.title : ''}
            />

            {/* Description */}
            <div className="input-wrapper">
              <textarea
                name="description"
                placeholder={isDescriptionFocused || formik.values.description ? 'Describe the item in detail...' : ''}
                value={formik.values.description}
                onChange={formik.handleChange}
                onFocus={() => setIsDescriptionFocused(true)}
                onBlur={(e) => {
                  formik.handleBlur(e);
                  setIsDescriptionFocused(false);
                }}
                className="input min-h-24"
              />
              <label className="input-label">Description</label>
              {formik.touched.description && formik.errors.description && (
                <p className="text-lost-color text-sm mt-2">{formik.errors.description}</p>
              )}
            </div>

            {/* Location */}
            <FloatingLabelInput
              label="Location"
              placeholder="e.g., Block C, Near Parking"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="location"
              error={formik.touched.location && formik.errors.location ? formik.errors.location : ''}
            />

            {/* Image Upload */}
            <div>
              <label className="text-sm font-dm font-medium text-ink-secondary mb-4 block">
                Upload Image *
              </label>

              {!imagePreview ? (
                <motion.div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    isDragActive
                      ? 'border-accent bg-accent-soft'
                      : 'border-border hover:border-accent-soft'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  whileHover={{ scale: 1.02 }}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="cursor-pointer block"
                  >
                    <div className="text-4xl mb-3 inline-flex items-center justify-center">
                      <ImageIcon size={34} />
                    </div>
                    <p className="font-dm font-medium text-ink-primary mb-1">
                      Drop image here or click to browse
                    </p>
                    <p className="text-sm text-ink-muted">
                      Max size: 5MB • JPG, PNG, WebP
                    </p>
                  </label>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative overflow-hidden rounded-xl"
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <motion.button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 btn btn-danger w-10 h-10 p-0 flex items-center justify-center text-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <motion.button
                type="submit"
                disabled={isLoading}
                className={`flex-1 btn btn-primary ${isLoading ? 'btn-loading' : ''}`}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {isLoading ? 'Creating...' : 'Create Post'}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 btn btn-secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default CreatePost;
