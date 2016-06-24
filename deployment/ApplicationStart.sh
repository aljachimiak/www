#!/bin/bash
THISDIR="$(cd `dirname "$0"` && pwd)"
source "$THISDIR/shared.sh"

# Start the application server with PM2
cd "$APPDIR"
su -c "'HOME=/home/ubuntu && pm2 start pm2.json --name $APPNAME'" $APPUSER

# Configure and restart Nginx
cp "$APPDIR/config/nginx/nginx.conf" /etc/nginx/nginx.conf
cp "$APPDIR/config/nginx/sites-available/default" /etc/nginx/sites-available/default

# Be careful to move the SSL cert files out of our application directory
if [ -f "$APPDIR/config/oddworks.io.chained.crt" ]; then
	mkdir -p /etc/nginx/ssl
	mv "$APPDIR/config/oddworks.io.chained.crt" /etc/nginx/ssl/
	chown root:root /etc/nginx/ssl/oddworks.io.chained.crt
fi
if [ -f "$APPDIR/config/oddworks.io.key" ]; then
	mkdir -p /etc/nginx/ssl
	mv "$APPDIR/config/oddworks.io.key" /etc/nginx/ssl/
	chown root:root /etc/nginx/ssl/oddworks.io.key
fi

service nginx restart
