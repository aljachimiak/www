#!/bin/bash
THISDIR="$(cd `dirname "$0"` && pwd)"
source "$THISDIR/shared.sh"

su -c "'HOME=/home/ubuntu && pm2 stop $APPNAME'" $APPUSER
