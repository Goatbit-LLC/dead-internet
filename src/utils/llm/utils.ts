export function cleanGeneratedContent(content: string, isReply: boolean = false): string {
  if (!content) return '';

  // First, extract any content after the last </think> tag
  const thinkMatches = content.split('</think>');
  let cleaned = thinkMatches[thinkMatches.length - 1].trim();
  
  // If there was no </think> tag, use the original content
  if (thinkMatches.length === 1) {
    cleaned = content;
  }

  // Remove any remaining <think> tags and their content
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

  // Common prefixes to remove
  const prefixesToRemove = [
    "Here's a social media post that reflects my personality and interests:",
    "Here's my post:",
    "Here's what I would post:",
    "I would write:",
    "My post would be:",
    "Here's a relevant reply:",
    "I would respond with:",
    "My response would be:",
    "INTERESTS:",
    "USERNAME:",
    "POST:",
    "CONTENT:",
    "RESPONSE:",
  ];

  // Remove prefixes
  for (const prefix of prefixesToRemove) {
    if (cleaned.toLowerCase().startsWith(prefix.toLowerCase())) {
      cleaned = cleaned.slice(prefix.length).trim();
    }
  }

  // Remove surrounding quotes
  cleaned = cleaned.replace(/^["']|["']$/g, '').trim();

  // Remove any trailing meta-comments
  const commentIndicators = [
    'I hope this post',
    'This post reflects',
    'This captures',
    'This response shows',
    'This maintains my',
    '[End of post]',
    '[Post ends]',
    '[Response ends]',
    'This is how I would post',
    'This aligns with my',
    'This demonstrates my',
  ];

  for (const indicator of commentIndicators) {
    const index = cleaned.toLowerCase().indexOf(indicator.toLowerCase());
    if (index !== -1) {
      cleaned = cleaned.slice(0, index).trim();
    }
  }

  // Remove any remaining square brackets and their content
  cleaned = cleaned.replace(/\[.*?\]/g, '').trim();

  // Remove all hashtags from the content if not a reply
  if (!isReply) {
    cleaned = cleaned.replace(/#\w+/g, '').trim();
  }

  return cleaned;
}

export function calculateInteractionProbability(post: { createdAt: string }): number {
  const postAge = Date.now() - new Date(post.createdAt).getTime();
  const dayInMs = 24 * 60 * 60 * 1000;
  const daysOld = postAge / dayInMs;
  
  // Exponential decay formula: probability = e^(-decay * days)
  // After 7 days, probability is ~50%
  // After 14 days, probability is ~25%
  // After 30 days, probability is ~5%
  const decay = 0.1;
  return Math.exp(-decay * daysOld);
}