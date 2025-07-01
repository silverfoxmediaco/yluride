#!/usr/bin/env bash
# exit on error
set -o errexit

# Clean install to avoid any cached issues
echo "Cleaning npm cache..."
npm cache clean --force

# Install root dependencies first
echo "Installing root dependencies..."
npm install

# Navigate to backend and clean install
echo "Installing backend dependencies..."
cd backend
rm -rf node_modules package-lock.json
npm install --production

# Navigate to frontend and build
echo "Building frontend..."
cd ../frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build

# Copy built frontend to backend for serving
echo "Copying frontend build to backend..."
cp -r build ../backend/

echo "Build complete!"