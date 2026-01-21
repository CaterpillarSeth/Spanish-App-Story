# Spanish Learning App

An AI-powered Spanish learning web application that helps you learn Spanish through personalized vocabulary tests, daily words, structured lessons, and custom story generation.

## 🚀 Quick Start - Deploy Now!

Ready to deploy? **[See DEPLOYMENT.md](./DEPLOYMENT.md)** for complete step-by-step instructions!

- **Frontend**: Netlify (free)
- **Backend**: Render (free)
- **Time needed**: 15 minutes
- **Cost**: Free (except OpenAI API usage ~$1-5/month)

### Or Run Locally

```bash
# Quick start (requires OpenAI API key in server/.env)
./start.sh

# Or manually:
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
cd client
npm install
npm run dev
```

Visit http://localhost:5173 to start learning!

---

## Features

### 📚 Weekly Vocabulary Test
- Learn 10 new words each week from the top 1000 most common Spanish words
- Multiple-choice format to test your knowledge
- Words you answer correctly are automatically added to your vocabulary
- Tracks your progress through the top 1000 words

### 📖 Daily Words
- Get a new verb and noun every day
- Learn words from the most frequently used Spanish vocabulary
- Add words to your personal vocabulary with one click
- Consistent daily practice to build language skills

### 🎓 Daily Lessons
- AI-generated structured lessons covering essential Spanish concepts
- Start from basics: alphabet, greetings, grammar fundamentals
- Recap tests before each new lesson to reinforce previous learning
- Progress through 20+ core Spanish topics

### 📝 Story Time
- Generate personalized stories in Spanish using ONLY your learned vocabulary
- Choose any topic you're interested in
- Stories are tailored to your current vocabulary level
- Includes both Spanish text and English translation
- View all your past generated stories

### 📊 Vocabulary Progress
- Track all words you've learned from the top 1000 list
- View words you've learned outside the top 1000
- Search and filter by word type (verb, noun, adjective, etc.)
- Visual progress bar showing how far you've come

## Technology Stack

### Backend
- **Node.js** with **Express** - REST API server
- **TypeScript** - Type-safe backend code
- **SQLite** with **better-sqlite3** - Lightweight database
- **OpenAI API** - AI-powered lesson and story generation

### Frontend
- **React 18** with **TypeScript** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with gradients and animations

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Spanish-App-Story
```

### 2. Backend Setup

```bash
cd server
npm install

# Create .env file
cp .env.example .env

# Add your OpenAI API key to .env
# OPENAI_API_KEY=your_api_key_here
```

### 3. Frontend Setup

```bash
cd ../client
npm install

# Create .env file (optional, defaults to localhost:3001)
cp .env.example .env
```

## Running the Application

### Development Mode

1. **Start the backend server:**
```bash
cd server
npm run dev
```
The server will run on `http://localhost:3001`

2. **Start the frontend dev server:**
```bash
cd client
npm run dev
```
The app will be available at `http://localhost:5173`

### Production Build

1. **Build the frontend:**
```bash
cd client
npm run build
```

2. **Build the backend:**
```bash
cd server
npm run build
npm start
```

## Project Structure

```
Spanish-App-Story/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API service layer
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   └── package.json
│
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API routes
│   │   ├── models/        # Data models
│   │   ├── utils/         # Utility functions
│   │   ├── data/          # Spanish words dataset
│   │   ├── database.ts    # Database setup
│   │   └── index.ts       # Server entry point
│   └── package.json
│
└── README.md
```

## API Endpoints

### Vocabulary
- `GET /api/vocabulary/progress` - Get user's vocabulary progress
- `GET /api/vocabulary/weekly` - Get weekly words
- `GET /api/vocabulary/daily/:type` - Get daily word (verb/noun)
- `POST /api/vocabulary/add` - Add word to vocabulary

### Tests
- `GET /api/tests/weekly` - Get weekly vocabulary test
- `POST /api/tests/weekly/submit` - Submit weekly test answers
- `POST /api/tests/recap/submit` - Submit lesson recap test

### Lessons
- `GET /api/lessons/current` - Get current lesson
- `GET /api/lessons/recap/:lessonNumber` - Get recap test for lesson
- `POST /api/lessons/complete` - Mark lesson as complete
- `GET /api/lessons/all` - Get all lessons

### Stories
- `POST /api/stories/generate` - Generate new story
- `GET /api/stories` - Get user's stories
- `GET /api/stories/:id` - Get specific story

## Database Schema

### Users
- Stores user information (currently single default user)

### Spanish_words
- Top 1000 Spanish words with translations and rankings

### Vocabulary
- User's learned vocabulary with word details

### Weekly_words
- Words learned from weekly tests

### Daily_words
- Daily verb and noun for each date

### Lessons
- AI-generated lessons with completion tracking

### Lesson_recaps
- Scores from lesson recap tests

### Stories
- User-generated stories with topics and content

## How to Use

1. **Start Learning**
   - Take the Weekly Test to learn your first 10 words
   - Visit Daily Words to expand your vocabulary daily

2. **Progress Through Lessons**
   - Begin with Lesson 1 (Spanish Alphabet)
   - Complete recap tests before advancing
   - Work through 20+ structured lessons

3. **Practice with Stories**
   - Once you have at least 10 words, generate stories
   - Choose any topic you're interested in
   - AI creates stories using only your vocabulary

4. **Track Your Progress**
   - View your vocabulary in My Progress
   - See how many of the top 1000 words you've learned
   - Filter and search through your learned words

## Features in Detail

### AI-Powered Generation
The app uses OpenAI's GPT-4o-mini model to generate:
- **Lessons**: Comprehensive Spanish lessons with examples and explanations
- **Recap Questions**: Multiple-choice questions testing lesson comprehension
- **Stories**: Creative narratives using only the user's learned vocabulary

### Vocabulary Tracking
- Automatic tracking of all learned words
- Words from weekly tests
- Words from daily practice
- Integration with story generation
- Searchable and filterable vocabulary list

### Progressive Learning
1. Weekly tests introduce 10 new words from top 1000
2. Daily words supplement with verbs and nouns
3. Lessons teach grammar and concepts
4. Recap tests ensure retention
5. Stories provide reading practice

## Configuration

### Environment Variables

**Server (.env)**
```
PORT=3001
OPENAI_API_KEY=your_api_key_here
```

**Client (.env)**
```
VITE_API_URL=http://localhost:3001/api
```

## Troubleshooting

### OpenAI API Errors
- Ensure your API key is valid and has credits
- Check that the API key is correctly set in `server/.env`

### Database Issues
- The database is created automatically on first run
- Located at `server/spanish-learning.db`
- Delete and restart server to reset database

### Port Conflicts
- Backend default: 3001
- Frontend default: 5173 (Vite)
- Change ports in respective .env files if needed

## Future Enhancements

Potential features to add:
- User authentication and multiple users
- Audio pronunciation for words
- Flashcard system for review
- Spaced repetition algorithm
- Mobile app version
- Conversation practice with AI
- Progress badges and achievements
- Social features to share stories

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Spanish word frequency data compiled from multiple sources
- OpenAI for GPT-4o-mini API
- React and Vite communities

## Support

For issues, questions, or suggestions, please open an issue on the repository.

---

Happy Learning! ¡Buena suerte con tu español!
