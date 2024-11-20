#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
while ! nc -z db 3306; do
  sleep 1
done

# Run migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Start the development server
echo "Starting in development mode..."
npm run dev