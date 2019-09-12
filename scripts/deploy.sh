#!/bin/bash

cd /home/dev/prodProxy
git pull origin master
npm run setup
pm2 startOrRestart ./scripts/prod.config.js --env production --update-env
