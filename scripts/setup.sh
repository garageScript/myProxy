#!/bin/bash

# Helper functions
command_exists() {
	command -v "$@" > /dev/null 2>&1
}

user_exists() {
  id "$1" &> /dev/null
}

# Check if docker is installed and stop the script if it's not
if ! command_exists docker; then
  echo "myProxy requires Docker to run"
  echo "Docker installation instructions: https://docs.docker.com/engine/install/"
  exit
fi

if ! command_exists node; then
  echo "Installing node"
  sudo apt-get install curl
  curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

if ! command_exists pm2; then
  echo "Installing pm2"
  npm install pm2 -g
fi

npm install

if [ ! -d "./acme.sh" ] ; then
  git clone https://github.com/Neilpang/acme.sh.git
  cd ./acme.sh
  ./acme.sh --install
  ./acme.sh --upgrade --auto-upgrade
  cd ../
fi

sudo groupadd -f docker

if ! user_exists myproxy; then
  echo "Creating user: myproxy"
  sudo useradd -m -c "myproxy" myproxy -s /bin/bash -p $(echo $ADMIN | openssl passwd -1 -stdin) -d "/home/myproxy"
  sudo usermod -aG docker myproxy
  mkdir -p /home/myproxy/.ssh
  mkdir -p /home/myproxy/.scripts
fi

if ! user_exists git; then
  echo "Creating user: git"
  sudo useradd -m -G myproxy -s $(which git-shell) -p $(echo $ADMIN | openssl passwd -1 -stdin) git
  sudo usermod -aG docker git
  mkdir -p /home/git/.ssh
  # Disable SSH MOTD message for git user
  touch /home/git/.hushlogin
  # Add git-shell message
  mkdir -p /home/git/git-shell-commands
  cp ./scripts/no-interactive-login /home/git/git-shell-commands/no-interactive-login
  chmod +x /home/git/git-shell-commands/no-interactive-login
fi

if [ -f "~/.ssh/authorized_keys" ]; then
  cp ~/.ssh/authorized_keys /home/myproxy/.ssh/authorized_keys
  cp ~/.ssh/authorized_keys /home/git/.ssh/authorized_keys
  # Prepend ssh options for authorized keys
  sed -i '/^ssh-rsa/s/^/no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty /' /home/git/.ssh/authorized_keys
else
  touch /home/myproxy/.ssh/authorized_keys
  touch /home/git/.ssh/authorized_keys
fi

cp ./scripts/post-receive /home/myproxy/.scripts/post-receive
cp ./scripts/pre-receive /home/myproxy/.scripts/pre-receive
cp ./scripts/gitignore /home/myproxy/.scripts/.gitignore

# fix file permissions
chown myproxy:myproxy -R /home/myproxy/
chown git:git -R /home/git/
chmod 2775 -R /home/myproxy/

npm run build

if [ ! -f "./data.db" ] ; then
  touch data.db
fi

# pull node docker image
if docker ps > /dev/null 2>&1; then
  docker pull node:alpine
else
  echo "WARNING: Couldn't run docker commands"
  echo "WARNING: Make sure your user has the right permissions"
  echo "WARNING: Go to this link to setup docker to run without root"
  echo "WARNING: https://docs.docker.com/engine/install/linux-postinstall/"
fi