const API_BASE_URL = 'https://gramseva-backend-8idx.onrender.com';

class ProfileAPI {
  // Test if backend is accessible
  static async testBackendConnection() {
    try {
      console.log('Testing backend connection...');
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'test'
        })
      });
      
      console.log('Backend test response status:', response.status);
      console.log('Backend test response headers:', response.headers);
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Backend test response data:', data);
        return { accessible: true, status: response.status };
      } else {
        const textResponse = await response.text();
        console.log('Backend test non-JSON response:', textResponse);
        return { accessible: true, status: response.status, isJson: false };
      }
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return { accessible: false, error: error.message };
    }
  }

  // Get current user profile
  static async getProfile() {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User not authenticated');
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Update current user profile
  static async updateProfile(profileData) {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User not authenticated');
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId
        },
        body: JSON.stringify(profileData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Delete current user account
  static async deleteAccount() {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User not authenticated');
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete account');
      return data;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }

  // Get all users (admin only)
  static async getAllUsers(page = 1, limit = 10, role = '', search = '') {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'getAll',
          userId: userId,
          page: page,
          limit: limit,
          role: role,
          search: search
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }

      return data;
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  // Get user by ID (admin only)
  static async getUserById(userId) {
    try {
      const currentUserId = localStorage.getItem('userId');
      if (!currentUserId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'getById',
          currentUserId: currentUserId
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user');
      }

      return data;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  }

  // Add new user (admin only)
  static async addUser(userData) {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/users/admin/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'add',
          currentUserId: userId,
          ...userData
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add user');
      }

      return data;
    } catch (error) {
      console.error('Add user error:', error);
      throw error;
    }
  }

  // Update user by ID (admin only)
  static async updateUserById(userId, userData) {
    try {
      const currentUserId = localStorage.getItem('userId');
      if (!currentUserId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'update',
          currentUserId: currentUserId,
          ...userData
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
      }

      return data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  // Delete user by ID (admin only)
  static async deleteUserById(userId) {
    try {
      const currentUserId = localStorage.getItem('userId');
      if (!currentUserId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'delete',
          currentUserId: currentUserId
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user');
      }

      return data;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }
}

export default ProfileAPI;