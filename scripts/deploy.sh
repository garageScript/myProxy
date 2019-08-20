#!/bin/bash

echo '🤖 Running deploy.sh...'
cd prodProxy

echo '⬇️ Pulling from master...'
git pull origin testing_branch

echo '📦 Installing packages...'
npm run setup

echo '🚧 Building production app...'
npm build

echo '🚀 Lunching server...'
pm2 startOrRestart ./scripts/prod.config.js --env production --update-env

echo '✅ Deploy scripts have been run successfully'