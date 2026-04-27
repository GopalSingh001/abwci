import { useState, useEffect } from 'react';
import { leadersAPI } from './api';

// Custom hook for managing leaders data
export const useLeaders = (params = {}) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchLeaders = async (fetchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await leadersAPI.getAll({ ...params, ...fetchParams });
      
      if (response.success) {
        setLeaders(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.error || 'Failed to fetch leaders');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch leaders');
      console.error('Error fetching leaders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, [JSON.stringify(params)]);

  return {
    leaders,
    loading,
    error,
    pagination,
    refetch: fetchLeaders,
  };
};

// Custom hook for managing a single leader
export const useLeader = (idOrSlug, isSlug = false) => {
  const [leader, setLeader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeader = async () => {
    if (!idOrSlug) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = isSlug 
        ? await leadersAPI.getBySlug(idOrSlug)
        : await leadersAPI.getById(idOrSlug);
      
      if (response.success) {
        setLeader(response.data);
      } else {
        setError(response.error || 'Leader not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch leader');
      console.error('Error fetching leader:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeader();
  }, [idOrSlug, isSlug]);

  return {
    leader,
    loading,
    error,
    refetch: fetchLeader,
  };
};

// Custom hook for managing leaders by category
export const useLeadersByCategory = (category) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeadersByCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Map category names to API endpoints
      const categoryEndpoints = {
        'Global Ambassadors': '/leaders/global-ambassadors',
        'Regional & Country Presidents': '/leaders/regional-presidents',
        'State Presidents': '/leaders/state-presidents',
        'Global Secretariat': '/leaders/global-secretariat'
      };
      
      const endpoint = categoryEndpoints[category];
      if (!endpoint) {
        throw new Error(`Unknown category: ${category}`);
      }
      
      // Fetch leaders from specific category endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}${endpoint}?limit=100`);
      const data = await response.json();
      
      if (data.success) {
        setLeaders(data.data);
      } else {
        setError(data.error || 'Failed to fetch leaders');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch leaders');
      console.error('Error fetching leaders by category:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadersByCategory();
  }, [category]);

  return {
    leaders,
    loading,
    error,
    refetch: fetchLeadersByCategory,
  };
};

