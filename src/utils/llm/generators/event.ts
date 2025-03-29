import type { Event, EventType } from '../../../types';
import { generateContent } from '../providers';
import { defaultRegions } from '../../generators';

interface CustomEventData {
  title?: string;
  description?: string;
  tags?: string[];
  regions?: string[];
}

export async function generateEvent(type: EventType, customData?: CustomEventData): Promise<Event> {
  if (!type) {
    throw new Error('Event type is required');
  }

  try {
    // If custom data is provided, use it directly
    if (customData?.title && customData?.description && customData?.tags) {
      const maxPosts = type === 'tag' ? 20 : type === 'regional' ? 35 : 50;

      return {
        id: crypto.randomUUID(),
        type,
        title: customData.title,
        description: customData.description,
        createdAt: new Date().toISOString(),
        tags: customData.tags,
        regions: type === 'regional' ? customData.regions : undefined,
        postCount: 0,
        maxPosts,
        active: true
      };
    }

    // Otherwise, generate event data using LLM
    const instructions = `Generate a ${type} event for a social media platform.

Event Types:
- Tag: Specific to certain topics/interests (e.g., new product launch, tech announcement)
- Regional: Affects specific regions (e.g., local elections, natural events)
- World: Global impact across multiple regions (e.g., major scientific discovery)

Available Regions: ${defaultRegions.join(', ')}

CRITICAL GUIDELINES:
1. Title: Short, newsworthy, and impactful (one line)
2. Description: One clear, concise sentence explaining the event's impact
3. Tags: 3-5 relevant hashtags:
   - MUST include one unique event-specific tag that combines key elements
   - Use hyphens for spaces (e.g., ai-breakthrough-2025)
   - All lowercase, no special characters except hyphens
   - Make tags descriptive and searchable
4. Regions (if regional): List 1-2 affected regions from the available regions list

CRITICAL: Format your response EXACTLY like this example, with each field on a new line:

TITLE: Major AI Breakthrough in Medical Research
DESCRIPTION: A revolutionary AI system successfully predicts protein structures for rare diseases, promising faster drug development.
TAGS: ai-medical-breakthrough-2025, artificial-intelligence, medical-research, healthcare-innovation
${type === 'regional' ? 'REGIONS: North America, Europe' : ''}

IMPORTANT:
- For TAG events: Focus on specific topics, trends, or product launches
- For REGIONAL events: Focus on events affecting specific geographical areas
- For WORLD events: Focus on global impact and widespread effects
- ALWAYS include a clear description of the event's impact
- ALWAYS start each field with the exact label (TITLE:, DESCRIPTION:, etc.)
- ALWAYS put each field on its own line
- NEVER include additional text or explanations`;

    const response = await generateContent(instructions);
    if (!response) {
      throw new Error('Empty response from LLM');
    }

    // Parse response line by line
    const lines = response.split('\n').map(line => line.trim()).filter(Boolean);
    let title = '';
    let description = '';
    let tags: string[] = [];
    let eventRegions: string[] | undefined;

    // Process each line
    for (const line of lines) {
      const [label, ...contentParts] = line.split(':');
      const content = contentParts.join(':').trim(); // Rejoin in case description contains colons

      switch (label.toUpperCase()) {
        case 'TITLE':
          title = content;
          break;
        case 'DESCRIPTION':
          description = content;
          break;
        case 'TAGS':
          tags = content
            .split(',')
            .map(tag => tag.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'))
            .filter(Boolean);
          break;
        case 'REGIONS':
          if (type === 'regional') {
            eventRegions = content
              .split(',')
              .map(region => region.trim())
              .filter(region => defaultRegions.includes(region));
          }
          break;
      }
    }

    // Validate required fields
    if (!title || title.length < 5) {
      throw new Error('Invalid or missing title');
    }
    if (!description || description.length < 10) {
      throw new Error('Invalid or missing description');
    }

    // Generate a unique event tag if none was provided
    if (!tags || tags.length === 0) {
      const timestamp = new Date().getFullYear();
      const eventTag = `${type}-${title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 30)}-${timestamp}`;
      
      tags = [eventTag, type];
    }

    // For regional events, ensure we have valid regions
    if (type === 'regional') {
      if (!eventRegions || eventRegions.length === 0) {
        const shuffled = [...defaultRegions].sort(() => Math.random() - 0.5);
        eventRegions = [shuffled[0]];
      }
    }

    const maxPosts = type === 'tag' ? 20 : type === 'regional' ? 35 : 50;

    return {
      id: crypto.randomUUID(),
      type,
      title,
      description,
      createdAt: new Date().toISOString(),
      tags,
      regions: eventRegions,
      postCount: 0,
      maxPosts,
      active: true
    };
  } catch (error) {
    console.error('Error in generateEvent:', error);
    
    // Generate a more descriptive fallback event based on type
    const timestamp = new Date().getFullYear();
    const fallbackEvent = (() => {
      switch (type) {
        case 'tag':
          return {
            title: 'Trending Topic Gains Momentum',
            description: 'A new trend is spreading across social media, sparking discussions and creative content.',
            tags: [`trending-topic-${timestamp}`, 'viral-content', 'social-media']
          };
        case 'regional':
          const selectedRegions = [defaultRegions[0]];
          return {
            title: `Local Event Impacts ${selectedRegions[0]}`,
            description: `A significant regional development is affecting communities across ${selectedRegions[0]}.`,
            tags: [`regional-event-${selectedRegions[0].toLowerCase().replace(/\s+/g, '-')}-${timestamp}`, 'local-news', 'community-impact'],
            regions: selectedRegions
          };
        case 'world':
          return {
            title: 'Global Phenomenon Captures Attention',
            description: 'A worldwide event is making headlines and generating discussions across all regions.',
            tags: [`global-event-${timestamp}`, 'worldwide-impact', 'international-news']
          };
        default:
          return {
            title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Event`,
            description: `A significant ${type} event is unfolding, attracting attention and engagement.`,
            tags: [`${type}-event-${timestamp}`, 'event-update']
          };
      }
    })();

    return {
      id: crypto.randomUUID(),
      type,
      ...fallbackEvent,
      createdAt: new Date().toISOString(),
      postCount: 0,
      maxPosts: type === 'tag' ? 20 : type === 'regional' ? 35 : 50,
      active: true
    };
  }
}