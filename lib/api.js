// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      let errPayload;
      try {
        errPayload = await response.json();
      } catch (_) {
        // ignore json parse error
      }
      let message = `HTTP error! status: ${response.status}`;
      if (errPayload && (errPayload.error || errPayload.message)) {
        const base = errPayload.error || errPayload.message;
        const details = Array.isArray(errPayload.details) ? `: ${errPayload.details.join(', ')}` : '';
        message = `${base}${details}`;
      }
      const err = new Error(message);
      err.status = response.status;
      if (errPayload) err.payload = errPayload;
      throw err;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Leaders API
export const leadersAPI = {
  // Get all leaders with pagination and filtering
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const endpoint = `/leaders${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },

  // Get leader by ID
  getById: async (id) => {
    return apiRequest(`/leaders/${id}`);
  },

  // Get leader by slug
  getBySlug: async (slug) => {
    return apiRequest(`/leaders/slug/${slug}`);
  },

  // Create new leader (admin only)
  create: async (leaderData) => {
    return apiRequest('/leaders', {
      method: 'POST',
      body: JSON.stringify(leaderData),
    });
  },

  // Update leader (admin only)
  update: async (id, leaderData) => {
    return apiRequest(`/leaders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leaderData),
    });
  },

  // Delete leader (admin only)
  delete: async (id) => {
    return apiRequest(`/leaders/${id}`, {
      method: 'DELETE',
    });
  },

  // Get leaders by category (admin only)
  getByCategory: async (category) => {
    return apiRequest(`/admin/leaders/category/${category}`);
  }
};

// Posts API
export const postsAPI = {
  // Get all posts with pagination and filtering
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.post_page) queryParams.append('post_page', params.post_page);
    if (params.post_status) queryParams.append('post_status', params.post_status);
    if (params.post_category) queryParams.append('post_category', params.post_category);
    if (params.post_highlighted) queryParams.append('post_highlighted', params.post_highlighted);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const endpoint = `/posts${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },

  // Get post by ID
  getById: async (id) => {
    return apiRequest(`/posts/${id}`);
  },

  // Get posts by page type
  getByPage: async (page, limit = 10) => {
    const endpoint = `/posts?post_page=${page}&limit=${limit}`;
    console.log('API Call - getByPage:', {
      page,
      limit,
      endpoint,
      fullUrl: `${API_BASE_URL}${endpoint}`
    });
    const result = await apiRequest(endpoint);
    console.log('API Response - getByPage:', {
      success: result.success,
      dataLength: result.data ? result.data.length : 0,
      error: result.error,
      data: result.data
    });
    return result;
  },

  // Get highlighted/featured posts (fallback to recent posts if no highlighted ones)
  getFeatured: async (limit = 5) => {
    // First try to get highlighted posts
    const highlightedResponse = await apiRequest(`/posts?post_page=blogs&post_highlighted=true&limit=${limit}`);
    
    // If we have highlighted posts, return them
    if (highlightedResponse.success && highlightedResponse.data.length > 0) {
      return highlightedResponse;
    }
    
    // Fallback: Get recent blogs and rotate them based on date
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const page = (dayOfYear % 10) + 1; // Rotate every day, cycle through 10 pages
    
    return apiRequest(`/posts?post_page=blogs&limit=${limit}&page=${page}`);
  },

  // Create new post (admin only)
  create: async (postData) => {
    return apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  // Update post (admin only)
  update: async (id, postData) => {
    return apiRequest(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  },

  // Delete post (admin only)
  delete: async (id) => {
    return apiRequest(`/posts/${id}`, {
      method: 'DELETE',
    });
  },
};

// Countries API
export const countriesAPI = {
  // Get all countries with pagination and search
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const endpoint = `/countries${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },

  // Get country by ID
  getById: async (id) => {
    return apiRequest(`/countries/${id}`);
  },

  // Get country by code
  getByCode: async (code) => {
    return apiRequest(`/countries/code/${code}`);
  },
};

// Success stories submissions
export const successStoriesAPI = {
  submit: async (formData) => {
    const endpoint = `/success-stories/submit`;
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      const message = data?.error || data?.message || 'Submission failed';
      const err = new Error(message);
      err.payload = data;
      throw err;
    }
    return data;
  },
};

// Generic API functions
export const api = {
  // Health check
  health: async () => {
    return apiRequest('/health');
  },
};

export default api;

// Support API
export const supportAPI = {
  submit: async ({ full_name, email, country_code, message }) => {
    return apiRequest('/support', {
      method: 'POST',
      body: JSON.stringify({ full_name, email, country_code, message }),
    });
  },
  list: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    const queryString = queryParams.toString();
    return apiRequest(`/support${queryString ? `?${queryString}` : ''}`);
  },
};

// Members API
export const membersAPI = {
  // Get member by user ID
  getByUserId: async (userId, token) => {
    return apiRequest(`/members/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  
  // Get member by ID
  getById: async (id, token) => {
    return apiRequest(`/members/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  
  // Get all members
  getAll: async (params = {}, token) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.member_type) queryParams.append('member_type', params.member_type);
    if (params.country) queryParams.append('country', params.country);
    if (params.sector) queryParams.append('sector', params.sector);
    const queryString = queryParams.toString();
    
    return apiRequest(`/members${queryString ? `?${queryString}` : ''}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login with email and password
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Verify OTP
  verifyOTP: async (otpData) => {
    return apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(otpData),
    });
  },

  // Resend OTP
  resendOTP: async (email) => {
    return apiRequest('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Get current user (requires auth token)
  getCurrentUser: async (token) => {
    return apiRequest('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Forgot password - send OTP
  forgotPassword: async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Reset password with OTP
  resetPassword: async (resetData) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData),
    });
  },
};
