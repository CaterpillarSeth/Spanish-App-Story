import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { vocabularyAPI } from '../api/api';
import './Home.css';

function Home() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await vocabularyAPI.getProgress();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <header className="home-header">
        <h1>Welcome to Your Spanish Learning Journey!</h1>
        <p className="subtitle">Learn Spanish with AI-powered stories and lessons</p>
      </header>

      <div className="stats-card">
        <h2>Your Progress</h2>
        <div className="stats-grid">
          <div className="stat">
            <div className="stat-value">{stats?.top1000Count || 0}</div>
            <div className="stat-label">Top 1000 Words Learned</div>
          </div>
          <div className="stat">
            <div className="stat-value">{stats?.totalCount || 0}</div>
            <div className="stat-label">Total Words</div>
          </div>
          <div className="stat">
            <div className="stat-value">{Math.round(((stats?.top1000Count || 0) / 1000) * 100)}%</div>
            <div className="stat-label">Progress</div>
          </div>
        </div>
      </div>

      <div className="features-grid">
        <Link to="/weekly-test" className="feature-card">
          <h3>Weekly Test</h3>
          <p>Learn 10 new words each week from the top 1000 most common Spanish words</p>
        </Link>

        <Link to="/daily-word" className="feature-card">
          <h3>Daily Word</h3>
          <p>Learn a new verb or noun every day to expand your vocabulary</p>
        </Link>

        <Link to="/lessons" className="feature-card">
          <h3>Daily Lessons</h3>
          <p>Master important Spanish concepts with structured lessons</p>
        </Link>

        <Link to="/stories" className="feature-card">
          <h3>Story Time</h3>
          <p>Practice reading with AI-generated stories using only your vocabulary</p>
        </Link>

        <Link to="/vocabulary" className="feature-card">
          <h3>My Vocabulary</h3>
          <p>Track all the words you've learned from the top 1000 list</p>
        </Link>
      </div>

      <div className="getting-started">
        <h2>Getting Started</h2>
        <ol>
          <li>Take the <Link to="/weekly-test">Weekly Test</Link> to learn your first 10 words</li>
          <li>Check your <Link to="/daily-word">Daily Word</Link> to expand your vocabulary</li>
          <li>Start your first <Link to="/lessons">Spanish Lesson</Link></li>
          <li>Generate a <Link to="/stories">Story</Link> once you have enough vocabulary</li>
          <li>Track your progress in <Link to="/vocabulary">My Vocabulary</Link></li>
        </ol>
      </div>
    </div>
  );
}

export default Home;
