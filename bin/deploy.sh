#!/bin/bash
THISDIR="$(cd `dirname "$0"` && pwd)"
ROOTDIR="$( dirname "$THISDIR" )"
BUILD="$ROOTDIR/build/deployment"

TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
APPNAME="oddnetworks-website"
GROUP_NAME="$APPNAME"
S3_BUCKET="oddnetworks-website-codedeploy"

rsync \
  --recursive \
  --delete \
  --perms \
  --times \
  --human-readable \
  --exclude-from="$ROOTDIR/config/push-exclude.list" \
  "$ROOTDIR/" "$BUILD/"

cp "$ROOTDIR/.production-env" "$BUILD/env"

aws deploy push \
  --region "$AWS_DEFAULT_REGION" \
  --application-name "$APPNAME" \
  --description "Revision $TIMESTAMP" \
  --ignore-hidden-files \
  --s3-location "s3://$S3_BUCKET/$APPNAME-$TIMESTAMP.zip" \
  --source ./build/deployment/ >/dev/null 2>&1

aws deploy create-deployment \
  --region "$AWS_DEFAULT_REGION" \
  --application-name "$APPNAME" \
  --s3-location bucket="$S3_BUCKET",key="$APPNAME-$TIMESTAMP.zip",bundleType=zip \
  --deployment-group-name "$GROUP_NAME" \
  --description "Deployment $TIMESTAMP" \
  --ignore-application-stop-failures
