import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { postAPI, resolveAssetUrl } from '../services/api';
import PageWrapper from '../components/PageWrapper';
import FloatingLabelInput from '../components/FloatingLabelInput';

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

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
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
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('type', values.type);
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('location', values.location);
        formData.append('category', values.category);

        if (values.image) {
          formData.append('image', values.image);
        }

        await postAPI.updatePost(id, formData);
        toast.success('Post updated successfully!');
        navigate('/my-posts');
      } catch (error) {
        if (error.response?.status === 403) {
          toast.error('You are not authorized to edit this post');
          navigate('/my-posts');
        } else {
          toast.error(error.response?.data?.message || 'Failed to update post');
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postAPI.getPostById(id);
      const post = response.data.post;
      formik.setValues({
        type: post.type,
        title: post.title,
        description: post.description,
        location: post.location,
        category: post.category,
        image: null,
      });
      if (post.imageUrl) {
        setCurrentImageUrl(resolveAssetUrl(post.imageUrl));
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('You are not authorized to edit this post');
        navigate('/my-posts');
      } else {
        toast.error('Failed to load post');
        navigate('/my-posts');
      }
    } finally {
      setIsPageLoading(false);
    }
  };

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

  if (isPageLoading) {
    return (
      <PageWrapper>
        <div className="container-md px-6 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent inline-block" />
          <p className="mt-4 text-ink-secondary">Loading post...</p>
        </div>
      </PageWrapper>
    );
  }

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
            Edit Post
          </h1>
          <p className="text-ink-secondary font-dm font-light">
            Update your item details
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
                Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'lost', icon: '⚠', label: 'Lost Item' },
                  { value: 'found', icon: '✓', label: 'Found Item' },
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
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <div className="font-syne font-bold text-ink-primary">
                      {option.label}
                    </div>
                  </motion.button>
                ))}
              </div>
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
                Image
              </label>

              {!imagePreview && currentImageUrl && (
                <motion.div
                  className="relative overflow-hidden rounded-xl mb-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <img
                    src={currentImageUrl}
                    alt="Current"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setCurrentImageUrl(null)}
                    className="absolute top-3 right-3 btn btn-danger w-8 h-8 p-0 flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                </motion.div>
              )}

              {!imagePreview && !currentImageUrl ? (
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
                  <label htmlFor="file-input" className="cursor-pointer block">
                    <div className="text-4xl mb-3">🖼️</div>
                    <p className="font-dm font-medium text-ink-primary mb-1">
                      Drop image here or click to browse
                    </p>
                    <p className="text-sm text-ink-muted">
                      Max size: 5MB • JPG, PNG, WebP
                    </p>
                  </label>
                </motion.div>
              ) : imagePreview ? (
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
                  >
                    ×
                  </motion.button>
                </motion.div>
              ) : null}
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
                {isLoading ? 'Updating...' : 'Update Post'}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => navigate('/my-posts')}
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

export default EditPost;
