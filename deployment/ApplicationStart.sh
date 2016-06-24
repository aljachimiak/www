#!/bin/bash
THISDIR="$(cd `dirname "$0"` && pwd)"
source "$THISDIR/shared.sh"

# Start the application server with PM2
cd "$APPDIR"
# su -c 'nohup bin/server >/var/logs/oddnetworks-www/combined.log 2>&1' $APPUSER
echo "run this command to start:"
echo "sudo su -c 'nohup bin/server >> /var/logs/oddnetworks-www/combined.log 2>&1' oddnetworks &"

# Configure and restart Nginx
cp "$APPDIR/config/nginx/nginx.conf" /etc/nginx/nginx.conf
cp "$APPDIR/config/nginx/sites-available/default" /etc/nginx/sites-available/default

service nginx restart
