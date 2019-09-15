#!/bin/bash

cd /home/dev/prodProxy
git pull origin master
npm run setup
npm run server
