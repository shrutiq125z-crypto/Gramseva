import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';
import ProfileAPI from '../services/profileApi';
import { gsap } from 'gsap';

const Profile = () => {
  const { user, logout } = useAuth();
  const { theme, isDark } = useTheme();
  const { addNotification } = useNotification();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  // Test function to check localStorage data
  const testLocalStorageData = () => {
    console.log('=== LocalStorage Debug ===');
    console.log('userId:', localStorage.getItem('userId'));
    console.log('user:', localStorage.getItem('user'));
    console.log('token:', localStorage.getItem('token'));
    
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        console.log('Parsed user data:', parsed);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  };

  // Call test function on mount
  useEffect(() => {
    testLocalStorageData();
    // Test backend connection
    ProfileAPI.testBackendConnection();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      console.log('Fetching profile...');
      
      // Check if user is authenticated
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not authenticated. Please login again.');
      }
      
      const response = await ProfileAPI.getProfile();
      console.log('Profile API response:', response);
      
      if (response && response.user) {
        setProfile(response.user);
        setEditForm(response.user);
        console.log('Profile data set:', response.user);
      } else {
        throw new Error('Invalid profile data received');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      addNotification({
        title: 'Error',
        message: error.message || 'Failed to fetch profile',
        type: 'error'
      });
      
      // If API fails, try to use data from localStorage as fallback
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log('Using localStorage data as fallback:', parsedUser);
          setProfile(parsedUser);
          setEditForm(parsedUser);
        } catch (parseError) {
          console.error('Error parsing localStorage user data:', parseError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (!profile) {
      addNotification({
        title: 'Error',
        message: 'Profile data not loaded. Please refresh the page.',
        type: 'error'
      });
      return;
    }
    setIsEditing(true);
    setEditForm(profile);
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(profile);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!editForm.username?.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!editForm.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!editForm.phoneNo?.trim()) {
      newErrors.phoneNo = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      // Only update local state, do NOT call the backend
      setProfile({
        ...profile,
        username: editForm.username,
        phoneNo: editForm.phoneNo,
        email: editForm.email,
        role: editForm.role,
        gender: editForm.gender,
        address: editForm.address,
      });
      setIsEditing(false);
      addNotification({
        title: 'Success',
        message: 'Profile updated locally (not saved to backend)',
        type: 'success'
      });
    } catch (error) {
      addNotification({
        title: 'Error',
        message: error.message || 'Failed to update profile',
        type: 'error'
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await ProfileAPI.deleteAccount();
      addNotification({
        title: 'Account Deleted',
        message: 'Your account has been deleted successfully',
        type: 'success'
      });
      logout();
    } catch (error) {
      addNotification({
        title: 'Error',
        message: error.message || 'Failed to delete account',
        type: 'error'
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
      case 'sarpanch': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200';
      case 'panchayat_member': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
      case 'villager': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      default: return 'bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200';
    }
  };

  const getGenderIcon = (gender) => {
    switch (gender) {
      case 'male': return '👨';
      case 'female': return '👩';
      case 'other': return '🧑';
      default: return '👤';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg text-gray-600 dark:text-gray-300">Loading profile...</span>
        </div>
      </div>
    );
  }

  // Show error state if no profile data
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center max-w-md mx-4 border border-red-200 dark:border-red-800">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Profile Data Not Available</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Unable to load your profile data. This might be due to a network issue or authentication problem.
          </p>
          <div className="space-y-3">
            <button 
              onClick={fetchProfile}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              🔄 Retry Loading Profile
            </button>
            <button 
              onClick={() => window.location.href = '/auth'}
              className="w-full bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              🔐 Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent animate-fade-in-up">
              👤 User Profile
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Manage your account information and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Debug Info - Remove this in production */}
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">🐛 Debug Info:</h4>
          <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <div>Profile Data: {profile ? '✅ Available' : '❌ Missing'}</div>
            <div>User ID: {localStorage.getItem('userId') || '❌ Missing'}</div>
            <div>User Data in localStorage: {localStorage.getItem('user') ? '✅ Available' : '❌ Missing'}</div>
            <div>Profile Username: {profile?.username || '❌ Missing'}</div>
            <div>Profile Email: {profile?.email || '❌ Missing'}</div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-large border border-gray-200/50 dark:border-gray-700/50 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
            <div className="relative flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-6xl border-4 border-white/30">
                  {profile?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {getGenderIcon(profile?.gender)}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2">{profile?.username}</h2>
                <p className="text-primary-100 text-lg mb-2">{profile?.email}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(profile?.role)}`}>
                    {profile?.role?.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {profile?.phoneNo}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/30 transition-all duration-300 hover:scale-105"
                    >
                      ✏️ Edit Profile
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-6 py-3 bg-red-500/80 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-red-600/80 transition-all duration-300 hover:scale-105"
                    >
                      🗑️ Delete Account
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 bg-green-500/80 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-green-600/80 transition-all duration-300 hover:scale-105"
                    >
                      💾 Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 bg-gray-500/80 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-gray-600/80 transition-all duration-300 hover:scale-105"
                    >
                      ❌ Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                  <span className="mr-3">👤</span>
                  Personal Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Username
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={editForm.username || ''}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.username ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300`}
                        placeholder="Enter username"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-gray-100">
                        {profile?.username}
                      </p>
                    )}
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editForm.email || ''}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300`}
                        placeholder="Enter email address"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-gray-100">
                        {profile?.email}
                      </p>
                    )}
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phoneNo"
                        value={editForm.phoneNo || ''}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.phoneNo ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300`}
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-gray-100">
                        {profile?.phoneNo}
                      </p>
                    )}
                    {errors.phoneNo && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phoneNo}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={editForm.gender || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer not to say">Prefer not to say</option>
                      </select>
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-gray-100">
                        {profile?.gender?.replace('_', ' ').toUpperCase()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                  <span className="mr-3">⚙️</span>
                  Account Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      User Role
                    </label>
                    <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-gray-100">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(profile?.role)}`}>
                        {profile?.role?.replace('_', ' ').toUpperCase()}
                      </span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Member Since
                    </label>
                    <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-gray-100">
                      {new Date(profile?.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Updated
                    </label>
                    <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-gray-100">
                      {new Date(profile?.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      User ID
                    </label>
                    <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-gray-100 font-mono text-sm">
                      {profile?.id}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Connected to Business
                    </label>
                    {isEditing ? (
                      <select
                        name="isBusi"
                        value={editForm.isBusi ? 'true' : 'false'}
                        onChange={e => setEditForm(prev => ({
                          ...prev,
                          isBusi: e.target.value === 'true'
                        }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-gray-100">
                        {profile?.isBusi ? 'Yes' : 'No'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            {profile?.address && Object.keys(profile.address).length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                  <span className="mr-3">🏠</span>
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(profile.address).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                      <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-gray-100">
                        {value || 'Not provided'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Delete Account
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;


