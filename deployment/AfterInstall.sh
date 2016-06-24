#!/bin/bash
THISDIR="$(cd `dirname "$0"` && pwd)"
source "$THISDIR/shared.sh"

# Change permissions on all directories so we can use them
find "$APPDIR" -type d -print0 | xargs -0 chmod 755
chmod 770 "$APPDIR/bin/server"
mkdir -p /var/logs/oddnetworks-www
chown oddnetworks:oddnetworks /var/logs/oddnetworks-www
chmod 775 /var/logs/oddnetworks-www

cd "$APPDIR"
npm update --production
