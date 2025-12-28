import React, { useState, useEffect } from 'react';
import './App.css';
import StoriesList from './components/StoriesList';
import StoryViewer from './components/StoryViewer';

function App() {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
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
    setSelectedStory(userStory);
  };

  const handleCloseStory = () => {
    setSelectedStory(null);
  };

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
        <StoriesList stories={stories} onStoryClick={handleStoryClick} />
      )}

      {selectedStory && (
        <StoryViewer
          userStories={selectedStory}
          onClose={handleCloseStory}
        />
      )}
    </div>
  );
}

export default App;
