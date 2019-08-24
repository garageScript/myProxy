#!/bin/bash

git pull origin master
npm run setup
npm run build
pm2 startOrRestart ./scripts/prod.config.js --env production --update-env