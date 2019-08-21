#!/usr/bin/env bash

# Install All dependencies
npm install

# Git clone & install acme.sh
if [! -d './acme.sh']; then
  git clone https://github.com/Neilpang/acme.sh.git
fi
cd ./acme.sh
./acme.sh --install

echo "? MyProxy has been set up successfully"