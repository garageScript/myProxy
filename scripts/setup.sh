#!/usr/bin/env bash

# Install All dependencies
npm install

# Git clone & install acme.sh
git clone https://github.com/Neilpang/acme.sh.git
cd ./acme.sh
./acme.sh --install

echo "✅  MyProxy has been set up successfully"