import React, { useState, useEffect, useCallback, useRef } from 'react';

const StoryViewer = ({ 
  stories, 
  initialUserIndex = 0, 
  userStoryProgress = {}, 
  onProgressChange,
  onUserSeen, 
  onClose 
}) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  // Get initial story index from progress or default to 0
  const initialStory = userStoryProgress[stories[initialUserIndex].id] || 0;
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStory);
  const [progress, setProgress] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const currentUser = stories[currentUserIndex];
  const currentStory = currentUser.stories[currentStoryIndex];
  const totalUserStories = currentUser.stories.length;
  const storyDuration = currentStory?.duration || 5000;
  
  // Ref to track if we're in a transition to prevent double clicks
  const isTransitioningResponse = useRef(false);

  // Update parent about progress whenever story changes
  useEffect(() => {
    if (onProgressChange) {
      onProgressChange(currentUser.id, currentStoryIndex);
    }
  }, [currentUser.id, currentStoryIndex, onProgressChange]);

  // Preload next image (same user)
  useEffect(() => {
    if (currentStoryIndex < totalUserStories - 1) {
      const nextImage = new Image();
      nextImage.src = currentUser.stories[currentStoryIndex + 1].url;
    }
  }, [currentStoryIndex, totalUserStories, currentUser.stories]);

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

  const changeUser = useCallback((newIndex) => {
    if (newIndex >= 0 && newIndex < stories.length) {
      setCurrentUserIndex(newIndex);
      // Resuming logic: Start from last seen + 1, or 0 if completed/new
      const nextUser = stories[newIndex];
      const savedIndex = userStoryProgress[nextUser.id] || 0;
      setCurrentStoryIndex(savedIndex);
    } else {
      onClose();
    }
  }, [stories, userStoryProgress, onClose]);

  const handleNext = useCallback(() => {
    if (isTransitioningResponse.current) return;

    if (currentStoryIndex < totalUserStories - 1) {
      // Next story, same user
      isTransitioningResponse.current = true;
      setCurrentStoryIndex(prev => prev + 1);
      setTimeout(() => { isTransitioningResponse.current = false; }, 300);
    } else {
      // User finished
      if (onUserSeen) onUserSeen(currentUser.id);
      
      if (currentUserIndex < stories.length - 1) {
        // Next user
        changeUser(currentUserIndex + 1);
      } else {
        // All stories finished
        onClose();
      }
    }
  }, [currentStoryIndex, totalUserStories, currentUserIndex, stories.length, currentUser.id, onUserSeen, changeUser, onClose]);

  const handlePrevious = useCallback(() => {
    if (isTransitioningResponse.current) return;

    if (currentStoryIndex > 0) {
      // Previous story, same user
      isTransitioningResponse.current = true;
      setCurrentStoryIndex(prev => prev - 1);
      setTimeout(() => { isTransitioningResponse.current = false; }, 300);
    } else {
      // Previous user
       if (currentUserIndex > 0) {
        changeUser(currentUserIndex - 1);
      } else {
        onClose();
      }
    }
  }, [currentStoryIndex, currentUserIndex, changeUser, onClose]);

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
          {currentUser.stories.map((_, index) => (
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
              src={currentUser.userAvatar}
              alt={currentUser.username}
              className="story-header-avatar"
            />
            <span className="story-header-username">{currentUser.username}</span>
          </div>
          <button className="story-close-btn" onClick={onClose} aria-label="Close story">
            ×
          </button>
        </div>

        {/* Story Content */}
        <div className="story-content">
          {!isImageLoaded && <div className="loading-spinner" />}
          <img
            key={`${currentUser.id}-${currentStory.id}`} // Force re-render for simple transition
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
