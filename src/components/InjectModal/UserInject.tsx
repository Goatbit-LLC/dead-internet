import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useSimulatorStore } from '../../store';
import { generateAvatar } from '../../utils/generators';
import type { User } from '../../types';

interface UserInjectProps {
  onClose: () => void;
}

export const UserInject: React.FC<UserInjectProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    username: '',
    age: 25,
    gender: 'male',
    region: 'North America',
    interactionValue: 5,
    interests: [],
    behavioralProfile: {
      tone: 'neutral',
      verbosity: 5,
      responseSpeed: 5
    }
  });

  const [newInterest, setNewInterest] = useState('');
  const { users } = useSimulatorStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const existingUsernames = users.map(u => u.username.toLowerCase());
    if (existingUsernames.includes(formData.username?.toLowerCase() || '')) {
      alert('Username already exists');
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      username: formData.username || '',
      avatar: generateAvatar(),
      interactionValue: formData.interactionValue || 5,
      interests: formData.interests || [],
      joinedAt: new Date().toISOString(),
      behavioralProfile: {
        tone: formData.behavioralProfile?.tone || 'neutral',
        verbosity: formData.behavioralProfile?.verbosity || 5,
        responseSpeed: formData.behavioralProfile?.responseSpeed || 5
      },
      age: formData.age || 25,
      gender: formData.gender as 'male' | 'female' | 'non-disclosed',
      region: formData.region || 'North America',
      usedTags: [],
      preferences: {
        likes: [],
        dislikes: []
      }
    };

    // Update the store with the new user
    useSimulatorStore.setState(state => ({
      users: [...state.users, newUser],
      recentActions: [{
        type: 'user',
        userId: newUser.id,
        timestamp: new Date().toISOString(),
        description: `New user ${newUser.username} joined (injected)`
      }, ...state.recentActions.slice(0, 49)]
    }));

    onClose();
  };

  const addInterest = () => {
    if (newInterest.trim() && formData.interests) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const removeInterest = (index: number) => {
    if (formData.interests) {
      setFormData({
        ...formData,
        interests: formData.interests.filter((_, i) => i !== index)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="text-xl font-semibold dark:text-white">Create Custom User</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Age
          </label>
          <input
            type="number"
            min="13"
            max="100"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value as User['gender'] })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-disclosed">Non-disclosed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Region
          </label>
          <select
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="North America">North America</option>
            <option value="South America">South America</option>
            <option value="Europe">Europe</option>
            <option value="Asia">Asia</option>
            <option value="Africa">Africa</option>
            <option value="Oceania">Oceania</option>
            <option value="Middle East">Middle East</option>
            <option value="Caribbean">Caribbean</option>
            <option value="Central America">Central America</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Interaction Value (1-10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.interactionValue}
            onChange={(e) => setFormData({ ...formData, interactionValue: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Communication Tone
          </label>
          <select
            value={formData.behavioralProfile?.tone}
            onChange={(e) => setFormData({
              ...formData,
              behavioralProfile: {
                ...formData.behavioralProfile!,
                tone: e.target.value as User['behavioralProfile']['tone']
              }
            })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="neutral">Neutral</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="enthusiastic">Enthusiastic</option>
            <option value="professional">Professional</option>
            <option value="humorous">Humorous</option>
            <option value="sarcastic">Sarcastic</option>
            <option value="intellectual">Intellectual</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Verbosity (1-10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.behavioralProfile?.verbosity}
            onChange={(e) => setFormData({
              ...formData,
              behavioralProfile: {
                ...formData.behavioralProfile!,
                verbosity: parseInt(e.target.value)
              }
            })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Brief</span>
            <span>Detailed</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Response Speed (1-10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.behavioralProfile?.responseSpeed}
            onChange={(e) => setFormData({
              ...formData,
              behavioralProfile: {
                ...formData.behavioralProfile!,
                responseSpeed: parseInt(e.target.value)
              }
            })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Interests
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addInterest();
              }
            }}
            placeholder="Add an interest..."
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="button"
            onClick={addInterest}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.interests?.map((interest, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-1"
            >
              {interest}
              <button
                type="button"
                onClick={() => removeInterest(index)}
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Create User
        </button>
      </div>
    </form>
  );
};