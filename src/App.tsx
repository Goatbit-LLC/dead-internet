import React, { useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { LoadingIndicator } from './components/LoadingIndicator';
import { useSimulatorStore } from './store';

function App() {
  const { isDarkMode } = useSimulatorStore();

  useEffect(() => {
    // Update the HTML class when dark mode changes
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <Dashboard />
      <LoadingIndicator />
    </div>
  );
}

export default App;