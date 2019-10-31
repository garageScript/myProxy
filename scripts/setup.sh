#!/bin/bash

if command node -v &>/dev/null; then
  sudo apt-get install curl
  curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
npm install
npm install pm2 -g
if [ ! -d "./acme.sh" ] ; then
  git clone https://github.com/Neilpang/acme.sh.git
  cd ./acme.sh
  ./acme.sh --install
  ./acme.sh --upgrade --auto-upgrade
  cd ../
fi
if [ ! -d "/home/git" ] ; then
  sudo useradd -m -c "git" git -s /bin/bash -p $(echo $ADMIN | openssl passwd -1 -stdin) -d /home/git
  sudo -u git bash <<EOF
    cd /home/git
    git clone https://github.com/garageScript/myproxy/
    mkdir .scripts
    cp myproxy/scripts/post-receive .scripts/post-receive
    cp myproxy/scripts/pre-receive .scripts/pre-receive
    rm -rf myproxy/ |\
    bash
EOF
fi
npm run build
if [ ! -f "./data.db" ] ; then
  touch data.db
fi
