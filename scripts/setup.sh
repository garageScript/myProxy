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
  mkdir /home/myproxy/.scripts
  cp ~/.ssh/authorized_keys /home/myproxy/.ssh/authorized_keys
  cp /scripts/post-receive /home/myproxy/.scripts/post-receive
  cp /scripts/pre-receive /home/myproxy/.scripts/pre-receive
  cp /scripts/gitignore /home/myproxy/.scripts/.gitignore
  chown myproxy:myproxy -R /home/myproxy/
fi
npm run build
if [ ! -f "./data.db" ] ; then
  touch data.db
fi
