import type { User, Post } from '../../../types';
import { generateContent } from '../providers';
import { calculateInteractionProbability } from '../utils';

export async function generateVoteKeywords(user: User, post: Post): Promise<{ isLike: boolean; keywords: string[] }> {
  const interactionProbability = calculateInteractionProbability(post);
  
  // Skip interaction based on post age
  if (Math.random() > interactionProbability) {
    return { isLike: false, keywords: [] };
  }

  const instructions = `Analyze this post and determine if the user would DISLIKE it based on their profile.
Only return DISLIKE if there are strong, specific reasons to dislike the content.
Default to LIKE unless there are clear conflicts with the user's preferences or beliefs.

User Profile:
- Username: ${user.username}
- Age: ${user.age}
- Gender: ${user.gender}
- Region: ${user.region}
- Interests: ${user.interests.join(', ')}
- Common likes: ${user.preferences.likes.slice(0, 5).map(l => l.keyword).join(', ')}
- Common dislikes: ${user.preferences.dislikes.slice(0, 5).map(d => d.keyword).join(', ')}
- Communication style: ${user.behavioralProfile.tone}

Post Content:
"${post.content}"

Post Tags: ${post.tags.map(t => '#' + t).join(' ')}

CRITICAL VOTING GUIDELINES:
1. Default to LIKE unless there are strong reasons to dislike
2. Consider these factors for DISLIKE:
   - Content directly contradicts user's core interests/beliefs
   - Topics user has consistently disliked in the past
   - Hostile/aggressive tone that conflicts with user's style
   - Content that would offend user's cultural/regional values
   - Clearly misleading or factually incorrect information
   - Direct conflict with user's demonstrated preferences

3. DO NOT dislike just because:
   - Content is neutral/uninteresting to the user
   - Minor tone mismatches
   - Different but non-conflicting viewpoints
   - Topics outside user's interests
   - Casual disagreements

4. IMPORTANT:
   - Be conservative with dislikes
   - Most content should be liked or ignored
   - Only dislike for strong, specific reasons
   - Consider the user's past voting patterns
   - Factor in the user's behavioral profile

Format your response EXACTLY like this:
VOTE: DISLIKE
REASON: misinformation

or
VOTE: LIKE
REASON: technology`;

  const response = await generateContent(instructions);

  // Parse the response
  const voteMatch = response.match(/VOTE:\s*(LIKE|DISLIKE)/i);
  const reasonMatch = response.match(/REASON:\s*(\w+)/i);

  if (!voteMatch || !reasonMatch) {
    // If parsing fails, default to like with high probability
    const isLike = Math.random() < 0.8; // 80% chance to like
    return {
      isLike,
      keywords: [isLike ? 'content' : 'irrelevant']
    };
  }

  const isLike = voteMatch[1].toUpperCase() === 'LIKE';
  const reason = reasonMatch[1].toLowerCase();

  return {
    isLike,
    keywords: [reason]
  };
}