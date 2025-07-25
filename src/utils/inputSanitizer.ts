import DOMPurify from 'dompurify';

// Configure DOMPurify with security settings
const createDOMPurify = () => {
  const purify = DOMPurify;
  
  // Configure allowed tags and attributes for different contexts
  purify.addHook('beforeSanitizeElements', (node) => {
    // Remove any script tags entirely
    if ((node as Element).tagName === 'SCRIPT') {
      (node as Element).remove();
    }
  });
  
  return purify;
};

const sanitizer = createDOMPurify();

// Sanitize plain text input (strips all HTML)
export const sanitizeText = (input: string): string => {
  if (!input) return '';
  return sanitizer.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

// Sanitize HTML content (allows basic formatting)
export const sanitizeHTML = (input: string): string => {
  if (!input) return '';
  return sanitizer.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
    ALLOWED_ATTR: [],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
  });
};

// Validate and sanitize prompt content
export const sanitizePromptContent = (content: string): string => {
  if (!content) return '';
  
  // First sanitize as text to remove any HTML
  const sanitized = sanitizeText(content);
  
  // Additional validation for prompt content
  if (sanitized.length > 10000) {
    throw new Error('Prompt content too long (max 10,000 characters)');
  }
  
  return sanitized.trim();
};

// Validate and sanitize titles and descriptions
export const sanitizeTitle = (title: string): string => {
  if (!title) return '';
  
  const sanitized = sanitizeText(title);
  
  if (sanitized.length > 200) {
    throw new Error('Title too long (max 200 characters)');
  }
  
  return sanitized.trim();
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Rate limiting helper for form submissions
const submissionTimes = new Map<string, number[]>();

export const checkRateLimit = (key: string, maxSubmissions = 5, timeWindow = 60000): boolean => {
  const now = Date.now();
  const times = submissionTimes.get(key) || [];
  
  // Remove old submissions outside the time window
  const recentTimes = times.filter(time => now - time < timeWindow);
  
  if (recentTimes.length >= maxSubmissions) {
    return false; // Rate limit exceeded
  }
  
  recentTimes.push(now);
  submissionTimes.set(key, recentTimes);
  return true;
};