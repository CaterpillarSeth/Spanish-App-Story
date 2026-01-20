import { useEffect, useState } from 'react';
import { storyAPI } from '../api/api';
import './Stories.css';

function Stories() {
  const [stories, setStories] = useState<any[]>([]);
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [currentStory, setCurrentStory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await storyAPI.getStories(10);
      setStories(response.data.stories);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateStory = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for your story');
      return;
    }

    setGenerating(true);
    setError('');
    
    try {
      const response = await storyAPI.generateStory(topic);
      setCurrentStory(response.data.story);
      setTopic('');
      fetchStories();
    } catch (error: any) {
      console.error('Error generating story:', error);
      setError(error.response?.data?.error || 'Failed to generate story. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !generating) {
      generateStory();
    }
  };

  return (
    <div className="stories-page">
      <div className="page-header">
        <h1>Story Time</h1>
        <p className="page-description">
          Generate personalized stories in Spanish using only the vocabulary you've learned
        </p>
      </div>

      <div className="story-generator">
        <h2>Generate a New Story</h2>
        <div className="generator-form">
          <input
            type="text"
            className="topic-input"
            placeholder="What do you want your story to be about? (e.g., 'a cat and a dog', 'going to the market')"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={generating}
          />
          <button
            className="generate-button"
            onClick={generateStory}
            disabled={generating}
          >
            {generating ? 'Generating...' : 'Generate Story'}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>

      {currentStory && (
        <div className="current-story">
          <h2>Your New Story</h2>
          <div className="story-content">
            {currentStory.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
      )}

      <div className="past-stories">
        <h2>Your Past Stories</h2>
        {loading ? (
          <div className="loading">Loading stories...</div>
        ) : stories.length === 0 ? (
          <div className="no-stories">
            <p>You haven't generated any stories yet.</p>
            <p>Complete the weekly test to learn enough words, then come back to create your first story!</p>
          </div>
        ) : (
          <div className="stories-list">
            {stories.map((story) => (
              <div key={story.id} className="story-card">
                <div className="story-header">
                  <h3>{story.topic}</h3>
                  <span className="story-date">
                    {new Date(story.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="story-preview">
                  {story.content.substring(0, 200)}...
                </div>
                <button
                  className="view-button"
                  onClick={() => setCurrentStory(story.content)}
                >
                  View Full Story
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Stories;
