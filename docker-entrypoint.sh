#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
while ! nc -z db 3306; do
  sleep 1
done

# Run migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Start Prisma Studio in the background
echo "Starting Prisma Studio..."
npx prisma studio --hostname 0.0.0.0 &

# Start the application
echo "Starting the application..."
npm start