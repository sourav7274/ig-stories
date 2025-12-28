import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import StoriesList from './components/StoriesList';
import StoryViewer from './components/StoryViewer';

function App() {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [seenUserIds, setSeenUserIds] = useState([]);
  const [userStoryProgress, setUserStoryProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stories from external file
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/stories.json');
        
        if (!response.ok) {
          throw new Error('Failed to fetch stories');
        }
        
        const data = await response.json();
        setStories(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError('Failed to load stories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleStoryClick = (userStory) => {
    const index = stories.findIndex(s => s.id === userStory.id);
    setSelectedUserIndex(index);
    setSelectedStory(userStory);
  };

  const handleCloseStory = () => {
    setSelectedStory(null);
  };

  const handleStoryProgress = useCallback((userId, storyIndex) => {
    setUserStoryProgress(prev => ({
      ...prev,
      [String(userId)]: storyIndex
    }));
  }, []);

  const handleUserSeen = useCallback((userId) => {
    setSeenUserIds(prev => {
      if (!prev.includes(userId)) {
        return [...prev, userId];
      }
      return prev;
    });
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Instagram Stories</h1>
      </header>

      {isLoading ? (
        <div className="empty-state">
          <div className="loading-spinner" />
          <p style={{ marginTop: '20px' }}>Loading stories...</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h2>Oops!</h2>
          <p>{error}</p>
        </div>
      ) : (
        <StoriesList 
          stories={stories} 
          onStoryClick={handleStoryClick} 
          seenUserIds={seenUserIds}
        />
      )}

      {selectedStory && (
        <StoryViewer
          stories={stories}
          initialUserIndex={selectedUserIndex}
          userStoryProgress={userStoryProgress}
          onProgressChange={handleStoryProgress}
          onUserSeen={handleUserSeen}
          onClose={handleCloseStory}
        />
      )}
    </div>
  );
}

export default App;
