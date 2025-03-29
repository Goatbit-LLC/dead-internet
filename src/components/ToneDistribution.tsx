import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Dices } from 'lucide-react';
import type { SimulationWeights } from '../types';

interface ToneCategory {
  name: string;
  tones: {
    id: keyof SimulationWeights['tone'];
    label: string;
    description: string;
  }[];
}

const toneCategories: ToneCategory[] = [
  {
    name: 'Positive',
    tones: [
      { id: 'friendly', label: 'Friendly', description: 'Warm and welcoming communication style' },
      { id: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and passionate expression' },
      { id: 'supportive', label: 'Supportive', description: 'Encouraging and helpful' },
      { id: 'empathetic', label: 'Empathetic', description: 'Understanding and compassionate' },
      { id: 'inspirational', label: 'Inspirational', description: 'Motivating and uplifting' },
      { id: 'playful', label: 'Playful', description: 'Light-hearted and fun' }
    ]
  },
  {
    name: 'Professional',
    tones: [
      { id: 'formal', label: 'Formal', description: 'Professional and structured communication' },
      { id: 'professional', label: 'Professional', description: 'Business-oriented and polished' },
      { id: 'analytical', label: 'Analytical', description: 'Logical and detail-oriented' },
      { id: 'technical', label: 'Technical', description: 'Specialized and precise language' },
      { id: 'educational', label: 'Educational', description: 'Informative and instructional' },
      { id: 'diplomatic', label: 'Diplomatic', description: 'Tactful and considerate' }
    ]
  },
  {
    name: 'Neutral',
    tones: [
      { id: 'neutral', label: 'Neutral', description: 'Balanced and impartial tone' },
      { id: 'casual', label: 'Casual', description: 'Relaxed and informal style' },
      { id: 'serious', label: 'Serious', description: 'Grave and no-nonsense' },
      { id: 'journalistic', label: 'Journalistic', description: 'Factual and news-oriented' }
    ]
  },
  {
    name: 'Creative',
    tones: [
      { id: 'creative', label: 'Creative', description: 'Imaginative and artistic expression' },
      { id: 'humorous', label: 'Humorous', description: 'Witty and entertaining' },
      { id: 'poetic', label: 'Poetic', description: 'Artistic and lyrical' },
      { id: 'storytelling', label: 'Storytelling', description: 'Narrative and engaging' }
    ]
  },
  {
    name: 'Intellectual',
    tones: [
      { id: 'intellectual', label: 'Intellectual', description: 'Academic and thoughtful discourse' },
      { id: 'philosophical', label: 'Philosophical', description: 'Contemplative and theoretical' },
      { id: 'controversial', label: 'Controversial', description: 'Provocative and debatable' }
    ]
  },
  {
    name: 'Critical',
    tones: [
      { id: 'critical', label: 'Critical', description: 'Evaluative and judgmental' },
      { id: 'cynical', label: 'Cynical', description: 'Skeptical and doubtful' },
      { id: 'sarcastic', label: 'Sarcastic', description: 'Ironic or satirical tone' },
      { id: 'snarky', label: 'Snarky', description: 'Sarcastic and cutting' }
    ]
  },
  {
    name: 'Negative',
    tones: [
      { id: 'pessimistic', label: 'Pessimistic', description: 'Negative outlook' },
      { id: 'aggressive', label: 'Aggressive', description: 'Forceful and confrontational' },
      { id: 'bitter', label: 'Bitter', description: 'Resentful and angry' },
      { id: 'hostile', label: 'Hostile', description: 'Antagonistic and unfriendly' },
      { id: 'dismissive', label: 'Dismissive', description: 'Rejecting and disregarding' },
      { id: 'argumentative', label: 'Argumentative', description: 'Disputatious and confrontational' },
      { id: 'condescending', label: 'Condescending', description: 'Patronizing and superior' }
    ]
  }
];

interface ToneSliderProps {
  tone: {
    id: keyof SimulationWeights['tone'];
    label: string;
    description: string;
  };
  value: number;
  onChange: (value: number) => void;
}

const ToneSlider: React.FC<ToneSliderProps> = ({ tone, value, onChange }) => (
  <div className="flex flex-col gap-1 py-2">
    <div className="flex items-center gap-4">
      <div className="min-w-[140px] text-sm font-medium text-gray-700">{tone.label}</div>
      <div className="flex-1">
        <input
          type="range"
          min="0.1"
          max="100"
          step="0.1"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="w-16 text-right text-sm font-medium text-gray-600">
        {value.toFixed(1)}%
      </div>
    </div>
    <div className="ml-[140px] text-xs text-gray-500">{tone.description}</div>
  </div>
);

interface ToneCategoryGroupProps {
  category: ToneCategory;
  weights: Record<string, number>;
  onChange: (key: string, value: number) => void;
}

const ToneCategoryGroup: React.FC<ToneCategoryGroupProps> = ({ category, weights, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const totalWeight = category.tones.reduce((sum, tone) => sum + (weights[tone.id] || 0), 0);

  return (
    <div className="border rounded-lg bg-white">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-900">{category.name}</h4>
          <span className="text-sm text-gray-500">({totalWeight.toFixed(1)}%)</span>
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isExpanded && (
        <div className="px-4 py-2 border-t space-y-2">
          {category.tones.map((tone) => (
            <ToneSlider
              key={tone.id}
              tone={tone}
              value={Math.max(0.1, weights[tone.id] || 0.1)}
              onChange={(value) => onChange(tone.id, value)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ToneDistributionProps {
  weights: SimulationWeights['tone'];
  onChange: (weights: Record<string, number>) => void;
}

export const ToneDistribution: React.FC<ToneDistributionProps> = ({ weights, onChange }) => {
  const total = Object.values(weights).reduce((sum, val) => sum + val, 0);
  const isValid = Math.abs(total - 100) < 0.01;

  const handleWeightChange = (key: string, value: number) => {
    const remaining = 100 - value;
    const otherKeys = Object.keys(weights).filter(k => k !== key);
    const otherTotal = otherKeys.reduce((sum, k) => sum + weights[k], 0);
    
    const newWeights = { ...weights };
    newWeights[key] = Number(value.toFixed(1));

    if (otherTotal > 0) {
      const ratio = remaining / otherTotal;
      otherKeys.forEach(k => {
        // Ensure minimum value of 0.1%
        newWeights[k] = Number(Math.max(0.1, weights[k] * ratio).toFixed(1));
      });

      // Adjust for rounding errors while maintaining minimum values
      const adjustedTotal = Object.values(newWeights).reduce((sum, w) => sum + w, 0);
      if (adjustedTotal !== 100) {
        const diff = 100 - adjustedTotal;
        const maxKey = otherKeys.reduce((a, b) => newWeights[a] > newWeights[b] ? a : b);
        newWeights[maxKey] = Number((newWeights[maxKey] + diff).toFixed(1));
      }
    } else {
      // If all other values were 0, distribute remaining evenly
      const equalShare = Math.max(0.1, remaining / otherKeys.length);
      otherKeys.forEach(k => {
        newWeights[k] = Number(equalShare.toFixed(1));
      });
    }

    onChange(newWeights);
  };

  const randomizeWeights = () => {
    const keys = Object.keys(weights);
    const newWeights = { ...weights };
    let remainingTotal = 100 - (keys.length - 1) * 0.1; // Reserve 0.1% for each tone

    // First, set minimum values
    keys.forEach(key => {
      newWeights[key] = 0.1;
    });

    // Then distribute remaining percentage
    for (let i = 0; i < keys.length - 1; i++) {
      const maxWeight = remainingTotal - (keys.length - i - 1) * 0.1;
      const weight = Math.random() * maxWeight;
      newWeights[keys[i]] += Number(weight.toFixed(1));
      remainingTotal -= weight;
    }

    // Add remaining to last key
    newWeights[keys[keys.length - 1]] += Number(remainingTotal.toFixed(1));

    onChange(newWeights);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
          Total: {total.toFixed(1)}%
        </div>
        <button
          type="button"
          onClick={randomizeWeights}
          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          title="Randomize weights"
        >
          <Dices size={16} />
        </button>
      </div>
      <div className="space-y-4">
        {toneCategories.map((category) => (
          <ToneCategoryGroup
            key={category.name}
            category={category}
            weights={weights}
            onChange={handleWeightChange}
          />
        ))}
      </div>
    </div>
  );
};