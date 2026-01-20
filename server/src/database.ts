import Database from 'better-sqlite3';
import path from 'path';
import { top1000SpanishWords } from './data/spanishWords';

const db = new Database(path.join(__dirname, '../spanish-learning.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS vocabulary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    word_id INTEGER NOT NULL,
    word TEXT NOT NULL,
    translation TEXT NOT NULL,
    word_type TEXT, -- verb, noun, adjective, etc.
    is_top_1000 BOOLEAN DEFAULT 1,
    learned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    source TEXT, -- 'weekly_test', 'daily_word'
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, word)
  );

  CREATE TABLE IF NOT EXISTS weekly_words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    word TEXT NOT NULL,
    translation TEXT NOT NULL,
    week_number INTEGER NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS daily_words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    word TEXT NOT NULL,
    translation TEXT NOT NULL,
    word_type TEXT NOT NULL, -- 'verb' or 'noun'
    date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, date, word_type)
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    lesson_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, lesson_number)
  );

  CREATE TABLE IF NOT EXISTS lesson_recaps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    lesson_number INTEGER NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    topic TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS spanish_words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT UNIQUE NOT NULL,
    translation TEXT NOT NULL,
    word_type TEXT,
    rank INTEGER NOT NULL,
    frequency_rank INTEGER
  );
`);

// Initialize Spanish words if table is empty
const count = db.prepare('SELECT COUNT(*) as count FROM spanish_words').get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare('INSERT INTO spanish_words (word, translation, word_type, rank) VALUES (?, ?, ?, ?)');
  const insertMany = db.transaction((words: typeof top1000SpanishWords) => {
    words.forEach(word => insert.run(word.word, word.translation, word.type, word.rank));
  });
  insertMany(top1000SpanishWords);
  console.log('Initialized Spanish words database');
}

// Create default user if none exists
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  db.prepare('INSERT INTO users (username) VALUES (?)').run('default_user');
  console.log('Created default user');
}

export default db;
