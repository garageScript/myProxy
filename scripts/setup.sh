#!/bin/bash

if ! command node -v &>/dev/null; then
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
if [ ! -d "/home/myproxy" ] ; then
  sudo useradd -m -c "myproxy" myproxy -s /bin/bash -p $(echo $ADMIN | openssl passwd -1 -stdin) -d "/home/myproxy"
  mkdir /home/myproxy/.ssh
  cp ~/.ssh/authorized_keys /home/myproxy/.ssh/authorized_keys
  chown myproxy:myproxy -R /home/myproxy/.ssh
  sudo -u myproxy bash <<EOF
    cd /home/myproxy
    git clone https://github.com/garageScript/myproxy/
    mkdir .scripts
    cp myproxy/scripts/post-receive .scripts/post-receive
    cp myproxy/scripts/pre-receive .scripts/pre-receive
    cp myproxy/scripts/gitgnore .scripts/.gitignore
    rm -rf myproxy/ |\
    bash
EOF
fi
npm run build
if [ ! -f "./data.db" ] ; then
  touch data.db
fi
