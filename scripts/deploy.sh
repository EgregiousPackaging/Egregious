#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x
# this should already be installed for github CI
# but isn't in the default image act uses
sudo apt-get update -y
sudo apt-get install rsync -y
# setup CI ssh access
eval `ssh-agent`
ssh-add - <<< "${DEPLOYMENT_SSH_KEY}"
cp ./scripts/known_hosts $HOME/.ssh/known_hosts
# setup public keys for manual access
rsync ./scripts/public_keys debian@51.195.149.81:/home/debian/.ssh/authorized_keys
# deploy
rsync -avz . --delete debian@51.195.149.81:/home/debian/egregious
ssh debian@51.195.149.81 'cd /home/debian/egregious; docker-compose up -d --build'
