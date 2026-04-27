import { useState, useEffect } from 'react';
import { postsAPI } from './api';

// Custom hook for managing posts data
export const usePosts = (params = {}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchPosts = async (fetchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await postsAPI.getAll({ ...params, ...fetchParams });
      
      if (response.success) {
        setPosts(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.error || 'Failed to fetch posts');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [JSON.stringify(params)]);

  return {
    posts,
    loading,
    error,
    pagination,
    refetch: fetchPosts,
  };
};

// Custom hook for managing a single post
export const usePost = (id) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPost = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await postsAPI.getById(id);
      
      if (response.success) {
        setPost(response.data);
      } else {
        setError(response.error || 'Post not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch post');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  return {
    post,
    loading,
    error,
    refetch: fetchPost,
  };
};

// Custom hook for managing posts by page type
export const usePostsByPage = (pageType, limit = 10) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPostsByPage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await postsAPI.getByPage(pageType, limit);
      
      if (response.success) {
        setPosts(response.data);
      } else {
        setError(response.error || 'Failed to fetch posts');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch posts');
      console.error('Error fetching posts by page:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsByPage();
  }, [pageType, limit]);

  return {
    posts,
    loading,
    error,
    refetch: fetchPostsByPage,
  };
};

// Custom hook for managing featured/highlighted posts
export const useFeaturedPosts = (limit = 5) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeaturedPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await postsAPI.getFeatured(limit);
      
      if (response.success) {
        setPosts(response.data);
      } else {
        setError(response.error || 'Failed to fetch featured posts');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch featured posts');
      console.error('Error fetching featured posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedPosts();
  }, [limit]);

  return {
    posts,
    loading,
    error,
    refetch: fetchFeaturedPosts,
  };
};

// Custom hook for managing posts by category
export const usePostsByCategory = (category, pageType = null, limit = 20) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPostsByCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        post_category: category,
        limit: limit
      };
      
      if (pageType) {
        params.post_page = pageType;
      }
      
      const response = await postsAPI.getAll(params);
      
      if (response.success) {
        setPosts(response.data);
      } else {
        setError(response.error || 'Failed to fetch posts');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch posts');
      console.error('Error fetching posts by category:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsByCategory();
  }, [category, pageType]);

  return {
    posts,
    loading,
    error,
    refetch: fetchPostsByCategory,
  };
};
