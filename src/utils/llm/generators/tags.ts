import { generateContent } from '../providers';
import type { User } from '../../../types';

export async function generateTags(content: string, user: User): Promise<string[]> {
  const instructions = `Analyze this social media post and generate relevant hashtags.

Post content:
"${content}"

CRITICAL TAGGING GUIDELINES:

1. Focus on ACTUAL CONTENT:
   - Tags must directly relate to topics mentioned in the post
   - Each tag must have clear evidence in the post content

2. Tag Specificity Rules:
   - Start with broader categories
   - Only use specific tags when necessary
   - Avoid over-specific combinations unless warranted

3. When to Use Specific Tags:
   - Named events (2024-olympics, wwdc-2025)
   - Product releases (iphone-15, ps5)
   - Specific locations (tokyo-tower, times-square)
   - Unique incidents (fresno-mothman)
   - Technical terms (react-hooks, quantum-computing)

4. Tag Structure:
   - Use hyphens for spaces
   - All lowercase
   - No special characters
   - Maximum 3 parts (e.g., home-coffee-roasting)

5. Tag Hierarchy Example:
   GOOD:
   - #coffee
   - #coffee-roasting
   - #home-coffee-roasting (if specifically about home roasting)

   BAD:
   - #coffee
   - #coffee-roasting
   - #home-coffee-roasting
   - #coffee-roasting-at-home (too long)
   - #home-roasting (redundant with above)

6. CRITICAL:
   - Tags must be clearly evidenced in the post
   - Broader tags should come first
   - Don't duplicate concepts across tags
   - Don't create variations of the same tag

Format your response EXACTLY like this:
TAGS: technology, web-development, react-native`;

  const response = await generateContent(instructions);

  const tagsMatch = response.match(/TAGS:\s*(.+)$/i);
  if (!tagsMatch) return [];

  return tagsMatch[1]
    .split(',')
    .map(tag => tag.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'))
    .filter(Boolean)
    .slice(0, 5);
}