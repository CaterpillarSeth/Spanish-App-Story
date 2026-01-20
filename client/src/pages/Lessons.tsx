import { useEffect, useState } from 'react';
import { lessonAPI, testAPI } from '../api/api';
import './Lessons.css';

interface RecapQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

function Lessons() {
  const [lesson, setLesson] = useState<any>(null);
  const [needsRecap, setNeedsRecap] = useState(false);
  const [recapQuestions, setRecapQuestions] = useState<RecapQuestion[]>([]);
  const [showRecap, setShowRecap] = useState(false);
  const [recapAnswers, setRecapAnswers] = useState<{[key: number]: string}>({});
  const [recapResults, setRecapResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLesson();
  }, []);

  const fetchLesson = async () => {
    try {
      const response = await lessonAPI.getCurrentLesson();
      setLesson(response.data.lesson);
      setNeedsRecap(response.data.needsRecap);
      
      if (response.data.needsRecap) {
        const recapResponse = await lessonAPI.getRecapTest(response.data.lesson.lesson_number);
        setRecapQuestions(recapResponse.data.questions);
        setShowRecap(true);
      }
    } catch (error) {
      console.error('Error fetching lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecapAnswer = (questionIndex: number, answer: string) => {
    setRecapAnswers({
      ...recapAnswers,
      [questionIndex]: answer
    });
  };

  const submitRecap = async () => {
    const answers = recapQuestions.map((q, index) => ({
      question: q.question,
      selectedAnswer: recapAnswers[index] || '',
      correctAnswer: q.correctAnswer,
      correct: recapAnswers[index] === q.correctAnswer
    }));

    try {
      const response = await testAPI.submitRecapTest({
        lessonNumber: lesson.lesson_number - 1,
        answers
      });
      setRecapResults(response.data);
      
      if (response.data.passed) {
        setTimeout(() => {
          setShowRecap(false);
          setRecapResults(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting recap:', error);
    }
  };

  const completeLesson = async () => {
    try {
      await lessonAPI.completeLesson(lesson.lesson_number);
      alert('Lesson completed! Great job!');
      window.location.reload();
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading your lesson...</div>;
  }

  if (showRecap && recapQuestions.length > 0) {
    const allAnswered = recapQuestions.every((_, index) => recapAnswers[index] !== undefined);

    return (
      <div className="lessons-page">
        <div className="recap-test">
          <h1>Lesson Recap Test</h1>
          <p className="recap-description">
            Before starting the new lesson, let's review what you learned in the previous lesson.
            You need to score at least 70% to proceed.
          </p>

          {recapResults && (
            <div className={`recap-results ${recapResults.passed ? 'passed' : 'failed'}`}>
              <h3>{recapResults.passed ? 'Passed!' : 'Keep Practicing'}</h3>
              <p>Score: {recapResults.score} / {recapResults.total} ({Math.round((recapResults.score / recapResults.total) * 100)}%)</p>
              <p>{recapResults.message}</p>
            </div>
          )}

          <div className="recap-questions">
            {recapQuestions.map((question, qIndex) => (
              <div key={qIndex} className="recap-question">
                <h3>{qIndex + 1}. {question.question}</h3>
                <div className="recap-options">
                  {question.options.map((option, oIndex) => (
                    <button
                      key={oIndex}
                      className={`recap-option ${recapAnswers[qIndex] === option ? 'selected' : ''}`}
                      onClick={() => handleRecapAnswer(qIndex, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            className="submit-recap-button"
            onClick={submitRecap}
            disabled={!allAnswered}
          >
            Submit Recap Test
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="lessons-page">
        <div className="no-lesson">
          <h2>No Lesson Available</h2>
          <p>Unable to load lesson. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lessons-page">
      <div className="lesson-container">
        <div className="lesson-header">
          <span className="lesson-number">Lesson {lesson.lesson_number}</span>
          <h1>{lesson.title}</h1>
        </div>

        <div 
          className="lesson-content"
          dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br />') }}
        />

        <div className="lesson-actions">
          <button className="complete-button" onClick={completeLesson}>
            Mark as Complete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Lessons;
