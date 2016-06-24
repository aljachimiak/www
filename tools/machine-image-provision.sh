#!/usr/bin/env bash

echo "************************************************************"
echo "Unbuntu apt-get dist-upgrade"
echo "************************************************************"
sudo apt-get update
# Prevent interactive menus during install
# http://askubuntu.com/questions/146921/how-do-i-apt-get-y-dist-upgrade-without-a-grub-config-prompt
sudo DEBIAN_FRONTEND=noninteractive apt-get dist-upgrade --assume-yes

sudo apt-get autoremove --assume-yes
sudo apt-get autoclean --assume-yes

echo "************************************************************"
echo "Install universally usefull packages"
echo "************************************************************"
sudo apt-get install --assume-yes \
  build-essential \
  libssl-dev \
  curl \
  wget \
  vim \
  tree \
  git-core \
  htop

echo "************************************************************"
echo "Install Nginx"
echo "************************************************************"
sudo apt-get install --assume-yes nginx

echo "************************************************************"
echo "Install Node.js"
echo "************************************************************"
wget -qO- https://deb.nodesource.com/setup_4.x | sudo bash -
sudo apt-get install --assume-yes nodejs
