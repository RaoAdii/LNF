import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import PageWrapper from '../components/PageWrapper';
import FloatingLabelInput from '../components/FloatingLabelInput';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [flatNumber, setFlatNumber] = useState(user?.flatNumber || '');
  const [block, setBlock] = useState(user?.block || '');
  const [saving, setSaving] = useState(false);

  const [previewUrl, setPreviewUrl] = useState(
    user?.avatar ? `${API_URL}/uploads/avatars/${user.avatar}` : null
  );
  const [avatarFile, setAvatarFile] = useState(null);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('flatNumber', flatNumber);
      formData.append('block', block);
      if (avatarFile) formData.append('avatar', avatarFile);

      const { data } = await api.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      updateUser(data.user);
      setAvatarFile(null);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageWrapper className="page-enter">
      <div className="container-md px-4 py-10">
        <h1 className="text-3xl font-syne font-bold text-ink-primary mb-6">My Profile</h1>

        <form onSubmit={handleSave}>
          <div className="glass rounded-[var(--radius-lg)] border border-[var(--border)] p-6">
            <h2 className="text-base font-syne font-semibold text-ink-primary mb-4">Profile Photo</h2>

            <div className="flex items-center gap-5 mb-6">
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'var(--accent-soft)',
                  border: '2px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span className="font-syne font-bold text-2xl text-accent">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="avatar-input" className="btn btn-secondary cursor-pointer inline-flex">
                  Change photo
                </label>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />

                {previewUrl && avatarFile && (
                  <button
                    type="button"
                    className="ml-3 text-sm text-lost-color"
                    onClick={() => {
                      setAvatarFile(null);
                      setPreviewUrl(user?.avatar ? `${API_URL}/uploads/avatars/${user.avatar}` : null);
                    }}
                  >
                    Remove
                  </button>
                )}

                <p className="text-xs text-ink-muted mt-2">JPEG, PNG or WebP - Max 2 MB</p>
              </div>
            </div>

            <h2 className="text-base font-syne font-semibold text-ink-primary mb-4">Personal Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatingLabelInput
                label="Full name *"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
              <FloatingLabelInput
                label="Phone"
                value={phone}
                type="tel"
                onChange={(event) => setPhone(event.target.value)}
              />
              <FloatingLabelInput
                label="Flat / Unit number"
                value={flatNumber}
                onChange={(event) => setFlatNumber(event.target.value)}
              />
              <FloatingLabelInput
                label="Block / Tower"
                value={block}
                onChange={(event) => setBlock(event.target.value)}
              />
            </div>

            <div className="mt-2 p-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)]">
              <p className="text-sm text-ink-secondary">
                <span className="font-semibold text-ink-primary">Email: </span>
                {user?.email}
                {user?.isVerified ? (
                  <span className="ml-2 text-xs text-found-color font-medium">Verified</span>
                ) : (
                  <span className="ml-2 text-xs text-lost-color">Not verified</span>
                )}
              </p>
              <p className="text-sm text-ink-secondary mt-1">
                <span className="font-semibold text-ink-primary">Role: </span>
                <span className="capitalize">{user?.role || 'user'}</span>
              </p>
            </div>

            <div className="flex justify-end mt-5 pt-4 border-t border-[var(--border)]">
              <button type="submit" className="btn btn-primary min-w-[150px]" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
