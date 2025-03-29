import { useSimulatorStore } from '../../../store';
import { useLLMStore } from '../../../store/llm';
import type { User, Event } from '../../../types';
import { generateContent } from '../providers';
import { cleanGeneratedContent, calculateInteractionProbability } from '../utils';

export async function generatePostContent(user: User, selectedEvent?: Event): Promise<string> {
  const config = useLLMStore.getState().config;
  const activeInstructions = (config.injectedInstructions || [])
    .filter(instruction => instruction.active)
    .map(instruction => instruction.content);

  // If no event was provided, check for relevant active events
  if (!selectedEvent) {
    const { events } = useSimulatorStore.getState();
    const activeEvents = events.filter(event => event.active);
    
    for (const event of activeEvents) {
      // Skip events that have reached their post limit
      if (event.postCount >= event.maxPosts) continue;

      // Calculate probability based on event age
      const probability = calculateInteractionProbability(event);
      
      // Check if user should engage with this event
      const isRelevant = (() => {
        switch (event.type) {
          case 'tag':
            // Higher chance if user's interests align with event tags
            return event.tags.some(tag => 
              user.interests.some(interest => 
                interest.toLowerCase().includes(tag)
              )
            ) && Math.random() < probability * 1.5;
          
          case 'regional':
            // Higher chance if event affects user's region
            return event.regions?.includes(user.region) && 
              Math.random() < probability * 2;
          
          case 'world':
            // Base chance for world events
            return Math.random() < probability;
          
          default:
            return false;
        }
      })();

      if (isRelevant) {
        selectedEvent = event;
        break;
      }
    }
  }

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

${selectedEvent ? `You are posting about this event:
Title: ${selectedEvent.title}
Description: ${selectedEvent.description}

Write a social media post that reflects your thoughts on this event.

IMPORTANT:
- React naturally based on your personality and interests
- Consider your region and background
- Express authentic opinions
- Stay true to your communication style
- Don't force agreement or disagreement` : 'Write a social media post that reflects your personality and interests.'}

IMPORTANT: Focus on writing natural, authentic content. Do not include hashtags in your post.

CRITICAL POST GUIDELINES:
1. Write authentically:
   - Use your natural voice
   - Express genuine opinions
   - Share real experiences
   - Stay true to your personality

2. Avoid clichés:
   - No "Just..."
   - No "Finally..."
   - No "Can't believe..."
   - No "So excited to..."

3. Be specific:
   - Include concrete details
   - Reference real situations
   - Use examples when relevant
   - Share actual experiences

4. Show personality:
   - Match your tone style
   - Use appropriate language
   - Maintain consistent voice
   - Express genuine emotions

5. Keep it natural:
   - Vary sentence length
   - Mix formal/informal
   - Use occasional emojis
   - Include natural pauses`;

  const content = await generateContent(userContext, config);
  return cleanGeneratedContent(content, false);
}