// Number formatting utilities
export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }

  // Convert to number if it's a string
  const number = typeof num === 'string' ? parseFloat(num) : num;

  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  } else {
    return number.toLocaleString();
  }
};

// Format number with commas for display
export const formatNumberWithCommas = (num) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }

  const number = typeof num === 'string' ? parseFloat(num) : num;
  return number.toLocaleString();
};

// Format percentage
export const formatPercentage = (num, decimals = 0) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0%';
  }

  const number = typeof num === 'string' ? parseFloat(num) : num;
  return `${number.toFixed(decimals)}%`;
};

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format relative time
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateString);
  }
};






