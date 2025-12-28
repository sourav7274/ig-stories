import React, { useState, useEffect, useCallback } from 'react';

const StoryViewer = ({ userStories, initialStoryIndex = 0, onClose }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const currentStory = userStories.stories[currentStoryIndex];
  const totalStories = userStories.stories.length;
  const storyDuration = currentStory?.duration || 5000;

  // Preload next image
  useEffect(() => {
    if (currentStoryIndex < totalStories - 1) {
      const nextImage = new Image();
      nextImage.src = userStories.stories[currentStoryIndex + 1].url;
    }
  }, [currentStoryIndex, totalStories, userStories.stories]);

  // Handle image loading
  useEffect(() => {
    setIsImageLoaded(false);
    setProgress(0);
    
    const img = new Image();
    img.onload = () => {
      setIsImageLoaded(true);
    };
    img.src = currentStory.url;
  }, [currentStory.url]);

  const handleNext = useCallback(() => {
    if (currentStoryIndex < totalStories - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      onClose();
    }
  }, [currentStoryIndex, totalStories, onClose]);

  const handlePrevious = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    } else {
      onClose();
    }
  }, [currentStoryIndex, onClose]);

  // Auto-advance story
  useEffect(() => {
    if (!isImageLoaded) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / storyDuration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        handleNext();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentStoryIndex, isImageLoaded, storyDuration, handleNext]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [handleNext, handlePrevious, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="story-viewer-overlay" onClick={onClose}>
      <div className="story-viewer" onClick={(e) => e.stopPropagation()}>
        {/* Progress Bars */}
        <div className="progress-bars">
          {userStories.stories.map((_, index) => (
            <div key={index} className="progress-bar">
              <div
                className={`progress-fill ${
                  index === currentStoryIndex
                    ? 'active'
                    : index < currentStoryIndex
                    ? 'completed'
                    : ''
                }`}
                style={{
                  width:
                    index === currentStoryIndex
                      ? `${progress}%`
                      : index < currentStoryIndex
                      ? '100%'
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="story-header">
          <div className="story-user-info">
            <img
              src={userStories.userAvatar}
              alt={userStories.username}
              className="story-header-avatar"
            />
            <span className="story-header-username">{userStories.username}</span>
          </div>
          <button className="story-close-btn" onClick={onClose} aria-label="Close story">
            ×
          </button>
        </div>

        {/* Story Content */}
        <div className="story-content">
          {!isImageLoaded && <div className="loading-spinner" />}
          <img
            src={currentStory.url}
            alt={`Story ${currentStoryIndex + 1}`}
            className={`story-image ${!isImageLoaded ? 'loading' : ''}`}
            onLoad={() => setIsImageLoaded(true)}
          />

          {/* Navigation Areas */}
          <div
            className="story-nav story-nav-prev"
            onClick={handlePrevious}
            aria-label="Previous story"
          />
          <div
            className="story-nav story-nav-next"
            onClick={handleNext}
            aria-label="Next story"
          />
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
