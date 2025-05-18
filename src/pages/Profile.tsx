import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '../stores/authStore';
import { User } from 'lucide-react';
import { formatDate } from '../utils/format';

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'NG', name: 'Nigeria' },
];

const Profile = () => {
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      country: user?.country || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(50, 'Must be 50 characters or less')
        .required('Required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      country: Yup.string()
        .required('Required'),
      currentPassword: Yup.string()
        .when('newPassword', {
          is: (val: string) => val && val.length > 0,
          then: (schema) => schema.required('Current password is required to set a new password'),
          otherwise: (schema) => schema,
        }),
      newPassword: Yup.string()
        .min(8, 'Must be at least 8 characters'),
      confirmPassword: Yup.string()
        .when('newPassword', {
          is: (val: string) => val && val.length > 0,
          then: (schema) => schema
            .required('Please confirm your password')
            .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
          otherwise: (schema) => schema,
        }),
    }),
    onSubmit: async (values) => {
      // For demo purposes, simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In real app, call the API to update user profile
      
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      
      setIsEditing(false);
    },
  });

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary"
          >
            Edit Profile
          </button>
        )}
      </div>
      
      {updateSuccess && (
        <div className="mb-6 bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Profile updated successfully!</span>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {!isEditing ? (
          <div className="p-6">
            <div className="flex items-center mb-8">
              <div className="avatar h-20 w-20 bg-primary-100 text-primary-600 mr-6">
                <User size={32} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-gray-500">{user?.email}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Member since {formatDate(user?.createdAt || '')}
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Name</h3>
                  <p className="text-gray-900">{user?.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Country</h3>
                  <p className="text-gray-900">{user?.country}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Account ID</h3>
                  <p className="text-gray-900">{user?.id}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="label">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={`input ${formik.touched.name && formik.errors.name ? 'border-error-500' : ''}`}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="form-error">{formik.errors.name}</div>
                  ) : null}
                </div>
                
                <div>
                  <label htmlFor="email" className="label">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`input ${formik.touched.email && formik.errors.email ? 'border-error-500' : ''}`}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="form-error">{formik.errors.email}</div>
                  ) : null}
                </div>
                
                <div>
                  <label htmlFor="country" className="label">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    className={`input ${formik.touched.country && formik.errors.country ? 'border-error-500' : ''}`}
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.country && formik.errors.country ? (
                    <div className="form-error">{formik.errors.country}</div>
                  ) : null}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currentPassword" className="label">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    className={`input ${formik.touched.currentPassword && formik.errors.currentPassword ? 'border-error-500' : ''}`}
                    value={formik.values.currentPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.currentPassword && formik.errors.currentPassword ? (
                    <div className="form-error">{formik.errors.currentPassword}</div>
                  ) : null}
                </div>
                
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="newPassword" className="label">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      className={`input ${formik.touched.newPassword && formik.errors.newPassword ? 'border-error-500' : ''}`}
                      value={formik.values.newPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.newPassword && formik.errors.newPassword ? (
                      <div className="form-error">{formik.errors.newPassword}</div>
                    ) : null}
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="label">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className={`input ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-error-500' : ''}`}
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                      <div className="form-error">{formik.errors.confirmPassword}</div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
      
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h2>
            
            <div className="border border-error-200 rounded-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Delete Account</h3>
                  <p className="text-sm text-gray-500">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    // In a real app, would show confirmation dialog and then delete account
                    logout();
                  }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;