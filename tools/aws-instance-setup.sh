#!/bin/bash
REGION="us-west-2"

# Create our application user
addgroup appreader
useradd --system -G appreader oddnetworks

# Install the AWS command line tools
apt-get -y update
apt-get -y install awscli
apt-get -y install ruby2.0

# Install the AWS CodeDeploy agent
cd /home/ubuntu
aws s3 cp "s3://aws-codedeploy-$REGION/latest/install" . --region "$REGION"
chmod +x ./install
./install auto

# Install application dependencies
apt-get -y install libkrb5-dev
npm install -g pm2@">=1.0.0 <1.1.3"
