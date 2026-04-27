/**
 * Utility function to format dates in a user-friendly way
 * @param {string|Date} dateString - ISO date string or Date object
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid
    }
    
    const {
      year = 'numeric',
      month = 'long',
      day = 'numeric',
      locale = 'en-US'
    } = options;
    
    return date.toLocaleDateString(locale, {
      year,
      month,
      day
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original on error
  }
}

/**
 * Format date in a short format (e.g., "Oct 1, 2024")
 */
export function formatDateShort(dateString) {
  return formatDate(dateString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format date in a long format (e.g., "October 1, 2024")
 */
export function formatDateLong(dateString) {
  return formatDate(dateString, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format date with time (e.g., "October 1, 2024 at 1:05 AM")
 */
export function formatDateTime(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    const dateStr = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    return `${dateStr} at ${timeStr}`;
  } catch (error) {
    console.error('Error formatting date time:', error);
    return dateString;
  }
}

