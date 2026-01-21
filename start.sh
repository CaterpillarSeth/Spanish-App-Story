#!/bin/bash

echo "🚀 Starting Spanish Learning App..."
echo ""

# Check if .env exists in server
if [ ! -f server/.env ]; then
    echo "⚠️  No .env file found in server/"
    echo "Creating from .env.example..."
    cp server/.env.example server/.env
    echo "✅ Created server/.env"
    echo "⚠️  IMPORTANT: Add your OpenAI API key to server/.env"
    echo ""
fi

# Check if node_modules exist
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server && npm install && cd ..
    echo "✅ Server dependencies installed"
    echo ""
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd client && npm install && cd ..
    echo "✅ Client dependencies installed"
    echo ""
fi

echo "🔧 Starting backend server on http://localhost:3001..."
cd server && npm run dev &
SERVER_PID=$!

echo "🎨 Starting frontend on http://localhost:5173..."
cd client && npm run dev &
CLIENT_PID=$!

echo ""
echo "✅ Both servers started!"
echo ""
echo "📝 Backend: http://localhost:3001"
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "kill $SERVER_PID $CLIENT_PID; exit" INT
wait
