import type { User, SimulationWeights } from '../../../types';
import { generateAvatar } from '../../generators';
import { generateContent } from '../providers';

export async function generateUser(weights: SimulationWeights, existingUsernames: string[] = []): Promise<User> {
  // Generate weighted random values for required fields
  const getWeightedValue = <T extends string>(distribution: Record<T, number>): T => {
    const total = Object.values(distribution).reduce((sum, w) => sum + w, 0);
    let random = Math.random() * total;
    
    for (const [key, weight] of Object.entries(distribution)) {
      random -= weight;
      if (random <= 0) {
        return key as T;
      }
    }
    
    return Object.keys(distribution)[0] as T;
  };

  const gender = getWeightedValue(weights.gender);
  const tone = getWeightedValue(weights.tone);
  const verbosity = getWeightedValue(weights.verbosity);

  // Generate age based on age range
  const ageRange = getWeightedValue(weights.ageRanges);
  const getAgeFromRange = (range: string): number => {
    const [min, max] = range.split('-').map(Number);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const age = getAgeFromRange(ageRange);

  // Generate interaction value based on weights
  const interactionLevel = getWeightedValue(weights.interactionValue);
  const interactionValue = (() => {
    switch (interactionLevel) {
      case 'low': return Math.floor(Math.random() * 3) + 1; // 1-3
      case 'medium': return Math.floor(Math.random() * 4) + 4; // 4-7
      case 'high': return Math.floor(Math.random() * 3) + 8; // 8-10
      default: return 5;
    }
  })();

  // Generate verbosity value
  const verbosityValue = (() => {
    switch (verbosity) {
      case 'low': return Math.floor(Math.random() * 3) + 1; // 1-3
      case 'medium': return Math.floor(Math.random() * 4) + 4; // 4-7
      case 'high': return Math.floor(Math.random() * 3) + 8; // 8-10
      default: return 5;
    }
  })();

  // Determine region based on weights setting
  let region: string;
  if (weights.useRegionWeights) {
    region = getWeightedValue(weights.regions);
  } else {
    // Generate region using LLM
    const regionPrompt = `Generate a region or location for a social media user.

CRITICAL GUIDELINES:
1. Create a unique, specific region or location
2. Can be:
   - A city or metropolitan area
   - A cultural region
   - A geographic region
   - A descriptive location
3. AVOID:
   - Generic continents
   - Country names alone
   - Vague terms like "urban" or "rural"
4. Make it:
   - Specific and memorable
   - Culturally relevant
   - Geographically plausible
   - 1-4 words maximum

Format your response EXACTLY like this:
REGION: Silicon Valley

or
REGION: Scottish Highlands

or
REGION: Tokyo Bay Area`;

    const response = await generateContent(regionPrompt);
    const regionMatch = response.match(/REGION:\s*(.+)$/i);
    region = regionMatch ? regionMatch[1].trim() : getWeightedValue(weights.regions);
  }

  const userPrompt = `Generate a unique username and 4-6 interests for a social media user with the following profile:

Demographics:
- Age: ${age}
- Gender: ${gender}
- Region: ${region}
- Tone: ${tone}
- Verbosity: ${verbosityValue}/10
- Interaction Level: ${interactionValue}/10

CRITICAL USERNAME GUIDELINES:
1. AVOID overused prefixes/suffixes:
   - No "Tech" prefix unless specifically tech-focused
   - No "Cyber" prefix
   - No "Digital" prefix
   - Limit numbers to max 2 digits
   
2. CREATE VARIETY:
   - Mix of interests and personality traits
   - Use unexpected combinations
   - Include hobby-related terms
   - Use creative wordplay
   
3. USERNAME RULES:
   - 3-15 characters
   - No special characters
   - Memorable and unique
   - Natural sounding

4. INTERESTS RULES:
   - Each interest must be 5 words or less
   - Be specific and descriptive
   - Mix activities and topics
   - Relate to user demographics
   - AVOID generic interests
   - Make interests unique to the user
   - Consider age, region, and tone
   - Include niche/specific interests

Format your response EXACTLY like this:
USERNAME: PixelPainter
INTERESTS: Vintage Synthesizer Repair, Bouldering, Science Fiction Writing, Urban Beekeeping, Sustainable Fashion`;

  let attempts = 0;
  const maxAttempts = 3;
  let username = '';
  let interests: string[] = [];

  while (attempts < maxAttempts) {
    const response = await generateContent(userPrompt);
    
    // Parse the LLM response
    const lines = response.split('\n').map(line => line.trim()).filter(Boolean);
    
    for (const line of lines) {
      if (line.toLowerCase().startsWith('username:')) {
        username = line.split(':')[1].trim();
      } else if (line.toLowerCase().startsWith('interests:')) {
        interests = line
          .substring(line.indexOf(':') + 1)
          .split(',')
          .map(interest => interest.trim())
          .filter(interest => {
            const wordCount = interest.split(/\s+/).length;
            return wordCount > 0 && wordCount <= 5;
          });
      }
    }

    // Check if we got valid data
    if (username && username.length >= 3 && !existingUsernames.includes(username.toLowerCase()) && interests.length >= 4) {
      break;
    }

    attempts++;
  }

  // If we still don't have a valid username after all attempts, generate a fallback
  if (!username || username.length < 3 || existingUsernames.includes(username.toLowerCase())) {
    const uniqueSuffix = Math.random().toString(36).slice(2, 4).toUpperCase();
    username = `User${uniqueSuffix}`;
  }

  // If we don't have enough interests, try one more time with a more specific prompt
  if (interests.length < 4) {
    const retryPrompt = `Based on this user's demographics (Age: ${age}, Gender: ${gender}, Region: ${region}), 
generate 4-6 SPECIFIC interests. Each interest must be unique, 5 words or less, and relate to real hobbies, 
activities, or topics that would genuinely interest someone with this profile.

Format: INTERESTS: Rock Climbing, Vintage Camera Collecting, Korean Cooking, Jazz Piano`;

    const retryResponse = await generateContent(retryPrompt);
    const interestsMatch = retryResponse.match(/INTERESTS:\s*(.+)$/i);
    
    if (interestsMatch) {
      interests = interestsMatch[1]
        .split(',')
        .map(interest => interest.trim())
        .filter(interest => {
          const wordCount = interest.split(/\s+/).length;
          return wordCount > 0 && wordCount <= 5;
        });
    }

    // If we still don't have enough interests, generate minimal interests based on demographics
    if (interests.length < 4) {
      interests = [
        `${region} Culture`,
        `Local ${gender === 'male' ? 'Sports' : 'Arts'}`,
        age < 30 ? 'Social Media' : 'Traditional Media',
        verbosityValue > 5 ? 'Creative Writing' : 'Visual Arts'
      ];
    }
  }

  return {
    id: crypto.randomUUID(),
    username,
    avatar: generateAvatar(),
    interactionValue,
    interests,
    joinedAt: new Date().toISOString(),
    behavioralProfile: {
      tone,
      verbosity: verbosityValue,
      responseSpeed: Math.floor(Math.random() * 10) + 1,
    },
    age,
    gender,
    region,
    usedTags: [],
    preferences: {
      likes: [],
      dislikes: []
    }
  };
}