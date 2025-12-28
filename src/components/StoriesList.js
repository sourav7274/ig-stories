import React from 'react';

const StoryRing = ({ totalStories, seenCount, isFullySeen }) => {
  const radius = 38; // Radius of the ring
  const strokeWidth = 2.5;
  const circumference = 2 * Math.PI * radius;
  
  // If only 1 story, show full circle
  if (totalStories === 1) {
    return (
      <svg width="84" height="84" viewBox="0 0 84 84" className="story-ring-svg">
        <defs>
          <linearGradient id="primary-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke={isFullySeen ? "#4a4a4a" : "url(#primary-gradient)"}
          strokeWidth={strokeWidth}
        />
      </svg>
    );
  }

  const gapLength = 4; // Gap between segments in pixels
  const segmentLength = (circumference / totalStories) - gapLength;
  const rotationOffset = -90; // Start at top
  const segmentAngle = 360 / totalStories;

  return (
    <svg width="84" height="84" viewBox="0 0 84 84" className="story-ring-svg">
      <defs>
        <linearGradient id="primary-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      {Array.from({ length: totalStories }).map((_, index) => {
        const isSeen = isFullySeen || index < seenCount;
        // Seen segments should be grey, unseen should be gradient
        const strokeColor = isSeen ? "#555555" : "url(#primary-gradient)";
        
        return (
          <circle
            key={index}
            cx="42"
            cy="42"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segmentLength} ${circumference}`}
            transform={`rotate(${rotationOffset + (segmentAngle * index)} 42 42)`}
            strokeLinecap="round" // Rounded edges for segments
          />
        );
      })}
    </svg>
  );
};

const StoriesList = ({ stories, onStoryClick, seenUserIds, userStoryProgress = {} }) => {
  if (!stories || stories.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📸</div>
        <h2>No Stories Available</h2>
        <p>Check back later for new stories</p>
      </div>
    );
  }

  return (
    <div className="stories-container">
      <div className="stories-list">
        {stories.map((userStory) => {
          // Calculate how many stories this user has seen
          const progressIndex = userStoryProgress[userStory.id] || userStoryProgress[String(userStory.id)];
          const seenCount = progressIndex !== undefined ? progressIndex : 0;
          const isFullySeen = seenUserIds.includes(userStory.id);

          return (
            <div
              key={userStory.id}
              className="story-item"
              onClick={() => onStoryClick(userStory)}
              role="button"
              tabIndex={0}
              aria-label={`View ${userStory.username}'s story`}
            >
              <div className="story-avatar-container">
                <StoryRing 
                  totalStories={userStory.stories.length}
                  seenCount={seenCount}
                  isFullySeen={isFullySeen}
                />
                <div className="story-avatar-inner">
                  <img
                    src={userStory.userAvatar}
                    alt={userStory.username}
                    className="story-avatar"
                  />
                </div>
              </div>
              <span className="story-username">{userStory.username}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StoriesList;
