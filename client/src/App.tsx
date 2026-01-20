import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import WeeklyTest from './pages/WeeklyTest';
import DailyWord from './pages/DailyWord';
import Lessons from './pages/Lessons';
import Stories from './pages/Stories';
import VocabularyProgress from './pages/VocabularyProgress';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weekly-test" element={<WeeklyTest />} />
          <Route path="/daily-word" element={<DailyWord />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/vocabulary" element={<VocabularyProgress />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
