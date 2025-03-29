import { useLLMStore } from '../../../store/llm';
import type { User, Post } from '../../../types';
import { generateContent } from '../providers';
import { cleanGeneratedContent } from '../utils';

export async function generateReplyContent(user: User, originalPost: Post, previousReplies: Post[]): Promise<string> {
  const config = useLLMStore.getState().config;
  const activeInstructions = (config.injectedInstructions || [])
    .filter(instruction => instruction.active)
    .map(instruction => instruction.content);

  const userContext = `You are ${user.username}, a user with the following profile:

Personal Information:
- Age: ${user.age}
- Gender: ${user.gender}
- Region: ${user.region}
- Member since: ${new Date(user.joinedAt).toLocaleDateString()}

Interests and Preferences:
- Primary interests: ${user.interests.join(', ')}
- Frequently used tags: ${user.usedTags.map(t => t.tag).join(', ')}
- Common likes: ${user.preferences.likes.slice(0, 5).map(l => l.keyword).join(', ')}
- Common dislikes: ${user.preferences.dislikes.slice(0, 5).map(d => d.keyword).join(', ')}

Communication Style:
- Tone: ${user.behavioralProfile.tone}
- Verbosity level: ${user.behavioralProfile.verbosity}/10
- Response speed: ${user.behavioralProfile.responseSpeed}/10
- Interaction value: ${user.interactionValue}/10

${activeInstructions.length > 0 ? `
CRITICAL BEHAVIORAL INSTRUCTIONS:
${activeInstructions.map(instruction => `- ${instruction}`).join('\n')}
` : ''}

You are replying to a discussion. Here is the conversation so far:

Original Post:
${originalPost.content}

${previousReplies.length > 0 ? `Previous Replies:
${previousReplies.map(reply => reply.content).join('\n\n')}` : ''}

Write a relevant reply that matches your personality and continues the discussion naturally.

IMPORTANT:
- Focus on writing natural, authentic content
- Do not include hashtags
- Stay on topic
- Consider the context of previous replies
- Maintain your communication style`;

  const content = await generateContent(userContext, config);
  return cleanGeneratedContent(content, true);
}