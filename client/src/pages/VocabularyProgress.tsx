import { useEffect, useState } from 'react';
import { vocabularyAPI } from '../api/api';
import './VocabularyProgress.css';

function VocabularyProgress() {
  const [vocabulary, setVocabulary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchVocabulary();
  }, []);

  const fetchVocabulary = async () => {
    try {
      const response = await vocabularyAPI.getProgress();
      setVocabulary(response.data);
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your vocabulary...</div>;
  }

  if (!vocabulary) {
    return (
      <div className="vocabulary-page">
        <div className="error-state">
          <h2>Unable to Load Vocabulary</h2>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  const filteredTop1000 = vocabulary.top1000.filter((word: any) => {
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.translation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || word.word_type === filterType;
    return matchesSearch && matchesType;
  });

  const filteredOthers = vocabulary.others.filter((word: any) => {
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.translation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || word.word_type === filterType;
    return matchesSearch && matchesType;
  });

  const progressPercentage = Math.round((vocabulary.top1000Count / 1000) * 100);

  return (
    <div className="vocabulary-page">
      <div className="page-header">
        <h1>My Vocabulary Progress</h1>
        <p className="page-description">
          Track all the Spanish words you've mastered
        </p>
      </div>

      <div className="progress-summary">
        <div className="progress-stat">
          <div className="stat-value">{vocabulary.top1000Count}</div>
          <div className="stat-label">Top 1000 Words</div>
        </div>
        <div className="progress-stat">
          <div className="stat-value">{vocabulary.totalCount}</div>
          <div className="stat-label">Total Words</div>
        </div>
        <div className="progress-stat">
          <div className="stat-value">{progressPercentage}%</div>
          <div className="stat-label">Progress</div>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}>
            <span className="progress-text">{vocabulary.top1000Count} / 1000</span>
          </div>
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search words..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="verb">Verbs</option>
          <option value="noun">Nouns</option>
          <option value="adjective">Adjectives</option>
          <option value="adverb">Adverbs</option>
          <option value="preposition">Prepositions</option>
          <option value="pronoun">Pronouns</option>
          <option value="conjunction">Conjunctions</option>
        </select>
      </div>

      {filteredTop1000.length > 0 && (
        <div className="vocabulary-section">
          <h2>Top 1000 Words ({filteredTop1000.length})</h2>
          <div className="words-grid">
            {filteredTop1000.map((word: any) => (
              <div key={word.id} className="word-card">
                <div className="word-rank">#{word.rank}</div>
                <div className="word-spanish">{word.word}</div>
                <div className="word-translation">{word.translation}</div>
                <div className="word-type">{word.word_type}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredOthers.length > 0 && (
        <div className="vocabulary-section">
          <h2>Other Words ({filteredOthers.length})</h2>
          <div className="words-grid">
            {filteredOthers.map((word: any) => (
              <div key={word.id} className="word-card other">
                <div className="word-spanish">{word.word}</div>
                <div className="word-translation">{word.translation}</div>
                <div className="word-type">{word.word_type}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredTop1000.length === 0 && filteredOthers.length === 0 && (
        <div className="no-results">
          {vocabulary.totalCount === 0 ? (
            <>
              <h3>No Words Yet</h3>
              <p>Start learning by taking the weekly test!</p>
            </>
          ) : (
            <>
              <h3>No Words Found</h3>
              <p>Try adjusting your search or filter.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default VocabularyProgress;
