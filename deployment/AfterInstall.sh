#!/bin/bash
THISDIR="$(cd `dirname "$0"` && pwd)"
source "$THISDIR/shared.sh"

# Change permissions on all directories so we can use them
find "$APPDIR" -type d -print0 | xargs -0 chmod 755

cd "$APPDIR"
npm update --production
