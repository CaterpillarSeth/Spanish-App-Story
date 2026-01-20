import { useEffect, useState } from 'react';
import { testAPI } from '../api/api';
import './WeeklyTest.css';

interface TestQuestion {
  word: string;
  wordId: number;
  wordType: string;
  correctAnswer: string;
  options: string[];
}

function WeeklyTest() {
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0);

  useEffect(() => {
    fetchTest();
  }, []);

  const fetchTest = async () => {
    try {
      const response = await testAPI.getWeeklyTest();
      if (response.data.completed) {
        setCompleted(true);
      } else {
        setQuestions(response.data.testQuestions);
        setCurrentWeek(response.data.currentWeek);
      }
    } catch (error) {
      console.error('Error fetching test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    const answers = questions.map((q, index) => ({
      word: q.word,
      wordId: q.wordId,
      wordType: q.wordType,
      correctAnswer: q.correctAnswer,
      selectedAnswer: selectedAnswers[index] || ''
    }));

    try {
      const response = await testAPI.submitWeeklyTest({
        answers,
        week: currentWeek
      });
      setResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading your weekly test...</div>;
  }

  if (completed) {
    return (
      <div className="weekly-test">
        <div className="completed-message">
          <h2>Test Already Completed!</h2>
          <p>You've already completed this week's vocabulary test. Come back next week for new words!</p>
          <p className="tip">In the meantime, practice with your daily words and generate stories to reinforce what you've learned.</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="weekly-test">
        <div className="results">
          <h2>Test Results</h2>
          <div className="score-display">
            <div className="score">{results.score} / {results.total}</div>
            <div className="percentage">{Math.round((results.score / results.total) * 100)}%</div>
          </div>
          
          <div className="results-list">
            <h3>Your Answers:</h3>
            {results.results.map((result: any, index: number) => (
              <div key={index} className={`result-item ${result.correct ? 'correct' : 'incorrect'}`}>
                <div className="result-word">{result.word}</div>
                <div className="result-answer">
                  Your answer: {result.selectedAnswer}
                  {!result.correct && (
                    <span className="correct-answer"> (Correct: {result.correctAnswer})</span>
                  )}
                </div>
                <div className="result-status">{result.correct ? '✓ Correct!' : '✗ Incorrect'}</div>
              </div>
            ))}
          </div>

          <p className="next-steps">
            Words you got correct have been added to your vocabulary! 
            You can now use them in story generation.
          </p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="weekly-test">
        <div className="no-questions">
          <h2>No Questions Available</h2>
          <p>Unable to generate test questions. Please try again later.</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== undefined;
  const allAnswered = questions.every((_, index) => selectedAnswers[index] !== undefined);

  return (
    <div className="weekly-test">
      <div className="test-header">
        <h1>Weekly Vocabulary Test</h1>
        <p className="test-description">
          Select the correct translation for each word. Words you answer correctly will be added to your vocabulary.
        </p>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="question-counter">Question {currentQuestion + 1} of {questions.length}</p>
      </div>

      <div className="question-card">
        <h2 className="spanish-word">{question.word}</h2>
        <p className="word-type">({question.wordType})</p>
        
        <div className="options">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${selectedAnswers[currentQuestion] === option ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="nav-button"
        >
          Previous
        </button>
        
        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="nav-button primary"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="nav-button primary submit"
          >
            Submit Test
          </button>
        )}
      </div>
    </div>
  );
}

export default WeeklyTest;
