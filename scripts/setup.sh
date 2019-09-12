#!/bin/bash

npm install
if [ ! -d "./acme.sh" ] ; then
  git clone https://github.com/Neilpang/acme.sh.git
fi
cd ./acme.sh
./acme.sh --install
npm run build