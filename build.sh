#!/bin/bash
set -e

echo "Installing server dependencies..."
cd server
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Pushing database schema..."
npx prisma db push

echo "Installing client dependencies..."
cd ../client
npm install

echo "Building client..."
npm run build

echo "Seeding database..."
cd ../server
node seed.js

echo "Build complete!"
