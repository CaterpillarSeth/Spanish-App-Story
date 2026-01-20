import { useEffect, useState } from 'react';
import { vocabularyAPI } from '../api/api';
import './DailyWord.css';

function DailyWord() {
  const [verbOfDay, setVerbOfDay] = useState<any>(null);
  const [nounOfDay, setNounOfDay] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showVerb, setShowVerb] = useState(true);
  const [showNoun, setShowNoun] = useState(true);

  useEffect(() => {
    fetchDailyWords();
  }, []);

  const fetchDailyWords = async () => {
    try {
      const [verbResponse, nounResponse] = await Promise.all([
        vocabularyAPI.getDailyWord('verb'),
        vocabularyAPI.getDailyWord('noun')
      ]);
      setVerbOfDay(verbResponse.data.dailyWord);
      setNounOfDay(nounResponse.data.dailyWord);
    } catch (error) {
      console.error('Error fetching daily words:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToVocabulary = async (word: any, type: 'verb' | 'noun') => {
    try {
      await vocabularyAPI.addWord({
        word: word.word,
        translation: word.translation,
        wordType: type,
        isTop1000: true,
        source: 'daily_word',
        wordId: word.id
      });
      alert(`"${word.word}" added to your vocabulary!`);
    } catch (error) {
      console.error('Error adding word:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading today's words...</div>;
  }

  return (
    <div className="daily-word-page">
      <div className="page-header">
        <h1>Daily Words</h1>
        <p className="page-description">
          Learn a new verb and noun every day to steadily build your vocabulary
        </p>
      </div>

      <div className="daily-words-container">
        {verbOfDay && (
          <div className="word-card verb-card">
            <div className="card-header">
              <h2>Verb of the Day</h2>
            </div>
            <div className="card-content">
              <div className="word-display">
                <div className="spanish">{verbOfDay.word}</div>
                <button
                  className="reveal-button"
                  onClick={() => setShowVerb(!showVerb)}
                >
                  {showVerb ? 'Hide' : 'Show'} Translation
                </button>
                {showVerb && (
                  <div className="translation">{verbOfDay.translation}</div>
                )}
              </div>
              <button
                className="add-button"
                onClick={() => handleAddToVocabulary(verbOfDay, 'verb')}
              >
                Add to My Vocabulary
              </button>
            </div>
          </div>
        )}

        {nounOfDay && (
          <div className="word-card noun-card">
            <div className="card-header">
              <h2>Noun of the Day</h2>
            </div>
            <div className="card-content">
              <div className="word-display">
                <div className="spanish">{nounOfDay.word}</div>
                <button
                  className="reveal-button"
                  onClick={() => setShowNoun(!showNoun)}
                >
                  {showNoun ? 'Hide' : 'Show'} Translation
                </button>
                {showNoun && (
                  <div className="translation">{nounOfDay.translation}</div>
                )}
              </div>
              <button
                className="add-button"
                onClick={() => handleAddToVocabulary(nounOfDay, 'noun')}
              >
                Add to My Vocabulary
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="info-section">
        <h3>Why Daily Words?</h3>
        <p>
          Learning new words consistently is key to language acquisition. Each day, we provide you with
          a verb and a noun from the most common Spanish words. Practice using these words in sentences,
          and don't forget to add them to your vocabulary so they can appear in your generated stories!
        </p>
      </div>
    </div>
  );
}

export default DailyWord;
