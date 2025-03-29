import React, { useState } from 'react';
import { MessageSquare, X, Syringe } from 'lucide-react';
import { ThemeToggle } from '../../ThemeToggle';
import { InjectModal } from '../../InjectModal';

const GhostIcon = () => (
  <svg 
    width="32" 
    height="32" 
    viewBox="0 0 60 73" 
    className="text-gray-900 dark:text-white"
    fill="currentColor"
  >
    <g transform="matrix(1,0,0,1,0.000113461,0.000152527)">
      <g transform="matrix(1,0,0,1,-92.1951,-213.091)">
        <g transform="matrix(0.67788,0,0,0.67788,121.841,250.034)">
          <g>
            <g transform="matrix(1.33333,0,0,1.33333,-66.6667,-66.6667)">
              <path d="M36.359,45.59C34.211,45.59 32.468,47.328 32.468,49.481C32.468,51.629 34.207,53.371 36.359,53.371C38.507,53.371 40.25,51.633 40.25,49.481C40.25,47.332 38.511,45.59 36.359,45.59Z" />
            </g>
            <g transform="matrix(1.33333,0,0,1.33333,-66.6667,-66.6667)">
              <path d="M64.051,45.59C61.903,45.59 60.16,47.328 60.16,49.481C60.16,51.629 61.899,53.371 64.051,53.371C66.199,53.371 67.942,51.633 67.942,49.481C67.942,47.332 66.203,45.59 64.051,45.59Z" />
            </g>
            <g transform="matrix(1.33333,0,0,1.33333,-66.6667,-66.6667)">
              <path d="M71.559,16.879C61.481,8.699 51.75,9.059 50.36,9.16C48.712,9.059 38.622,8.801 28.661,16.879C17.2,26.18 17.2,42.238 17.2,47.52L17.2,86.379C17.2,87.09 17.579,87.75 18.2,88.11C19.438,88.828 21.239,89.66 24.18,89.66C27.962,89.66 29.989,88.281 31.63,87.18C33.11,86.18 34.29,85.379 36.841,85.379C39.391,85.379 40.571,86.168 42.051,87.18C43.692,88.289 45.723,89.66 49.501,89.66C53.282,89.66 55.309,88.281 56.95,87.18C58.43,86.18 59.61,85.379 62.161,85.379C64.712,85.379 65.891,86.168 67.372,87.18C69.012,88.289 71.044,89.66 74.821,89.66C78.602,89.66 80.629,88.281 82.129,87.281C82.68,86.91 83.008,86.293 83.008,85.621L83.008,47.531C83.008,42.25 83.008,26.179 71.547,16.89L71.559,16.879ZM79.02,84.531C77.989,85.16 76.809,85.66 74.828,85.66C72.278,85.66 71.098,84.871 69.618,83.859C67.977,82.75 65.946,81.379 62.168,81.379C58.387,81.379 56.36,82.758 54.719,83.859C53.239,84.859 52.059,85.66 49.508,85.66C46.957,85.66 45.778,84.871 44.297,83.859C42.657,82.75 40.625,81.379 36.848,81.379C33.067,81.379 31.04,82.758 29.399,83.859C27.918,84.859 26.739,85.66 24.188,85.66C22.88,85.66 21.95,85.449 21.208,85.148L21.208,47.527C21.208,39.176 22.239,27.246 31.188,19.988C40.516,12.418 50.129,13.148 50.219,13.16C50.368,13.172 50.52,13.172 50.668,13.16C51.547,13.101 60.18,12.801 69.047,20C77.989,27.262 79.028,39.191 79.028,47.539L79.028,84.551L79.02,84.531Z" />
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const Header: React.FC = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showInjectModal, setShowInjectModal] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <MessageSquare className="text-green-500" />
          <h2 className="text-xl font-semibold dark:text-white">Posts Feed</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInjectModal(true)}
            className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
            title="Inject Content"
          >
            <Syringe size={20} />
          </button>
          <ThemeToggle />
          <button
            onClick={() => setShowInfoModal(true)}
          >
            <GhostIcon />
          </button>
        </div>
      </div>

      <InjectModal
        isOpen={showInjectModal}
        onClose={() => setShowInjectModal(false)}
      />

      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-900 dark:text-white">
                <img 
                  src="/dead-internet-light.png" 
                  alt="Dead Internet Logo" 
                  className="h-12 block dark:hidden"
                />
                <img 
                  src="/dead-internet-dark.png" 
                  alt="Dead Internet Logo" 
                  className="h-12 hidden dark:block"
                />
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Version</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">v1.0</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                <a
                  href="http://goatbit.net/dead-internet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  www.goatbit.net
                </a>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Release Notes</p>
                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Initial Release</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• First public release</li>
                    <li>• Core simulation features</li>
                    <li>• User management</li>
                    <li>• Post generation</li>
                    <li>• Event system</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};