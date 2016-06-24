#!/bin/bash

aws ec2 run-instances \
  --debug \
  --image-id "$AMI_ID" \
  --key-name "$KEY_NAME" \
  --user-data "file://tools/aws-instance-setup.sh" \
  --count 1 \
  --instance-type "$INSTANCE_TYPE" \
  --region "$AWS_DEFAULT_REGION" \
  --security-group-ids "$SECURITY_GROUP_A" \

echo "Copy the InstanceId: property and tag it with tools/aws/tag-instances.sh"
