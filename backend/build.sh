#!/bin/bash
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Cleaning up old installations..."
rm -rf node_modules package-lock.json
echo "Installing backend dependencies..."
npm install
echo "Building frontend..."
cd ../frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
echo "Copying build to backend..."
cp -r build ../backend/
echo "Build complete!"