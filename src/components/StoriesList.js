import React from 'react';

const StoriesList = ({ stories, onStoryClick }) => {
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
        {stories.map((userStory) => (
          <div
            key={userStory.id}
            className="story-item"
            onClick={() => onStoryClick(userStory)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onStoryClick(userStory);
              }
            }}
            aria-label={`View ${userStory.username}'s story`}
          >
            <div className="story-avatar-wrapper">
              <img
                src={userStory.userAvatar}
                alt={userStory.username}
                className="story-avatar"
              />
            </div>
            <span className="story-username">{userStory.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoriesList;
