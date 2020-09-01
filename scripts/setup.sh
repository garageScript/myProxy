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
  # Add users
  sudo useradd -m -c "myproxy" myproxy -s /bin/bash -p $(echo $ADMIN | openssl passwd -1 -stdin) -d "/home/myproxy"
  sudo useradd -m -G myproxy -s $(which git-shell) -p $(echo $ADMIN | openssl passwd -1 -stdin) git
  # Add sudoers rule for git user to run pm2 as myproxy, without password
  echo "git ALL = (myproxy) NOPASSWD: /usr/bin/pm2" > /etc/sudoers.d/git
  # Create folders
  mkdir /home/myproxy/.ssh
  mkdir /home/git/.ssh
  mkdir /home/myproxy/.scripts
  # Copy ssh keys and scripts
  cp ~/.ssh/authorized_keys /home/myproxy/.ssh/authorized_keys
  cp ~/.ssh/authorized_keys /home/git/.ssh/authorized_keys
  cp ./scripts/post-receive /home/myproxy/.scripts/post-receive
  cp ./scripts/pre-receive /home/myproxy/.scripts/pre-receive
  cp ./scripts/gitignore /home/myproxy/.scripts/.gitignore
  # Disable SSH MOTD message for git user
  touch /home/git/.hushlogin
  # Add git-shell message
  mkdir /home/git/git-shell-commands
  cp ./scripts/no-interactive-login /home/git/git-shell-commands/no-interactive-login
  chmod +x /home/git/git-shell-commands/no-interactive-login
  # fix file permissions
  chown myproxy:myproxy -R /home/myproxy/
  chown git:git -R /home/git/
  chmod 2775 -R /home/myproxy/
  # Prepend ssh options for authorized keys
  sed -i '/^ssh-rsa/s/^/no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty /' /home/git/.ssh/authorized_keys
fi
npm run build
if [ ! -f "./data.db" ] ; then
  touch data.db
fi
