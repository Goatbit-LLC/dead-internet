import type { EventType } from '../../../../types';

export const useEventStyles = (type: EventType) => {
  const getBackgroundColor = () => {
    switch (type) {
      case 'tag':
        return 'bg-green-50 dark:bg-green-900';
      case 'regional':
        return 'bg-blue-50 dark:bg-blue-900';
      case 'world':
        return 'bg-red-50 dark:bg-red-900';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'tag':
        return 'border-green-200 dark:border-green-800';
      case 'regional':
        return 'border-blue-200 dark:border-blue-800';
      case 'world':
        return 'border-red-200 dark:border-red-800';
    }
  };

  return {
    backgroundColor: getBackgroundColor(),
    borderColor: getBorderColor()
  };
};