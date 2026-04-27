/**
 * Utility function to clean HTML content from blog posts
 * Removes HTML tags, decodes entities, and formats text properly
 */

export function cleanHtmlContent(htmlString) {
  if (!htmlString || typeof htmlString !== 'string') {
    return '';
  }

  let cleaned = htmlString;
  
  // Remove literal \r\n strings first (in case they're escaped)
  cleaned = cleaned.replace(/\\r\\n/g, '\n');
  cleaned = cleaned.replace(/\\r/g, '\n');
  cleaned = cleaned.replace(/\\n/g, '\n');

  // Remove HTML image tags (keep alt text if available)
  cleaned = cleaned.replace(/<img[^>]*alt=["']([^"']*)["'][^>]*>/gi, (match, altText) => {
    return altText ? `[Image: ${altText}]` : '';
  });
  cleaned = cleaned.replace(/<img[^>]*>/gi, '');

  // Convert HTML lists to plain text with bullets
  cleaned = cleaned.replace(/<ul[^>]*>/gi, '\n');
  cleaned = cleaned.replace(/<\/ul>/gi, '\n');
  cleaned = cleaned.replace(/<ol[^>]*>/gi, '\n');
  cleaned = cleaned.replace(/<\/ol>/gi, '\n');
  cleaned = cleaned.replace(/<li[^>]*>/gi, '• ');
  cleaned = cleaned.replace(/<\/li>/gi, '\n');

  // Convert paragraph tags to line breaks (preserve double line breaks for paragraphs)
  cleaned = cleaned.replace(/<p[^>]*>/gi, '');
  cleaned = cleaned.replace(/<\/p>/gi, '\n\n');
  
  // Convert heading tags to line breaks with spacing
  cleaned = cleaned.replace(/<h[1-6][^>]*>/gi, '\n\n');
  cleaned = cleaned.replace(/<\/h[1-6]>/gi, '\n\n');

  // Convert line breaks
  cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
  cleaned = cleaned.replace(/<br>/gi, '\n');

  // Remove all remaining HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  cleaned = cleaned
    .replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&middot;/g, '•')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");

  // Clean up whitespace - preserve paragraph breaks
  // First normalize all line break types to \n
  cleaned = cleaned
    .replace(/\r\n/g, '\n')  // Windows line breaks
    .replace(/\r/g, '\n')    // Old Mac line breaks
    .replace(/\n{4,}/g, '\n\n\n')  // Max 3 consecutive line breaks (for spacing)
    .replace(/[ \t]+/g, ' ')  // Multiple spaces to single space
    .replace(/^\s+|\s+$/gm, '')  // Trim each line
    .trim();
  
  // Convert single line breaks between non-empty lines to double line breaks (paragraph breaks)
  // This handles cases where content has single \r\n between paragraphs
  // But be smart about it - only convert if the next line starts with a capital letter (likely new paragraph)
  // or if the line ends with a period/question mark/exclamation
  cleaned = cleaned.replace(/([.!?])\n([A-Z])/g, '$1\n\n$2');  // Sentence end followed by capital = new paragraph
  cleaned = cleaned.replace(/([^\n\s])\n([^\n\s])/g, '$1\n\n$2');  // General case
  
  // Ensure proper paragraph spacing - normalize multiple line breaks
  cleaned = cleaned.replace(/\n\n\n+/g, '\n\n');  // Normalize to max 2 line breaks

  // Remove image path references that might be left
  cleaned = cleaned.replace(/\.\.\/\.\.\/\.\.\/public\/uploads\/[^\s]+/g, '');
  cleaned = cleaned.replace(/uploads\/[^\s]+\.(jpg|jpeg|png|gif|webp)/gi, '');
  
  // Final cleanup - remove any remaining \r\n or literal \r\n strings
  cleaned = cleaned.replace(/\r\n/g, '\n');
  cleaned = cleaned.replace(/\r/g, '\n');
  cleaned = cleaned.replace(/\\r\\n/g, '\n');
  cleaned = cleaned.replace(/\\r/g, '\n');
  cleaned = cleaned.replace(/\\n/g, '\n');

  return cleaned;
}

/**
 * Clean HTML but preserve some formatting (for rich text display)
 */
export function cleanHtmlPreserveFormatting(htmlString) {
  if (!htmlString || typeof htmlString !== 'string') {
    return '';
  }

  let cleaned = htmlString;

  // Remove image tags
  cleaned = cleaned.replace(/<img[^>]*>/gi, '');

  // Remove inline styles
  cleaned = cleaned.replace(/style=["'][^"']*["']/gi, '');
  cleaned = cleaned.replace(/class=["'][^"']*["']/gi, '');

  // Convert strong/bold to keep text
  cleaned = cleaned.replace(/<(strong|b)[^>]*>/gi, '<strong>');
  cleaned = cleaned.replace(/<\/(strong|b)>/gi, '</strong>');

  // Convert emphasis/italic to keep text
  cleaned = cleaned.replace(/<(em|i)[^>]*>/gi, '<em>');
  cleaned = cleaned.replace(/<\/(em|i)>/gi, '</em>');

  // Keep links but clean attributes
  cleaned = cleaned.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>/gi, '<a href="$1">');
  cleaned = cleaned.replace(/<\/a>/gi, '</a>');

  // Remove all other HTML tags except p, br, ul, ol, li, strong, em, a
  cleaned = cleaned.replace(/<(?!\/?(?:p|br|ul|ol|li|strong|em|a|h[1-6])\b)[^>]+>/gi, '');

  // Decode HTML entities
  cleaned = cleaned
    .replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&middot;/g, '•')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");

  // Clean up image paths
  cleaned = cleaned.replace(/\.\.\/\.\.\/\.\.\/public\/uploads\/[^\s"']+/g, '');
  cleaned = cleaned.replace(/uploads\/[^\s"']+\.(jpg|jpeg|png|gif|webp)/gi, '');

  // Clean up whitespace
  cleaned = cleaned
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();

  return cleaned;
}

