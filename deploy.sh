#!/usr/bin/env bash

set -e

source ~/.bin/dotfiles/.secrets.zconfig

rsync -av --ignore-existing "$HOME/dev/music-tools" shane@$NIGHTINGALE:/var/www/html
