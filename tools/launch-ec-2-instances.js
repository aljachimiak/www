const Promise = require('bluebird');
const AWS = require('aws-sdk');
const filepath = require('filepath');

const U = require('../lib/u');

const USER_DATA_SCRIPT = filepath
	.create(__dirname)
	.append('aws-instance-setup.sh');

// args.accessKeyId - String
// args.secretAccessKey - String
// args.region - String
// args.imageId - String
// args.count - Number
// args.iamInstanceProfile - String URN
// args.monitoring - Boolean
// args.instanceType - String
// args.keyName - String
// args.securityGroups - Array of IDs
// args.tags - Array of {key, value} Objects
// args.ebsOptimized - Boolean
exports.main = function (args) {
	args = U.cloneDeep(args || {});

	const ec2 = new AWS.EC2({
		apiVersion: '2016-04-01',
		accessKeyId: args.accessKeyId,
		secretAccessKey: args.secretAccessKey,
		region: args.region
	});

	return USER_DATA_SCRIPT.read({encoding: null})
		.then(userData => {
			args.userData = userData;
			return runInstances(ec2, args);
		})
		.then(instances => {
			args.launchedInstances = instances;
			args.instances = instances.Instances.map(instance => {
				return instance.InstanceId;
			});
			return createTags(ec2, args);
		})
		.then(() => {
			return {
				region: args.region,
				accessKeyId: args.accessKeyId,
				imageId: args.imageId,
				tags: args.tags,
				instanceType: args.instanceType,
				count: args.count,
				instances: args.instances,
				securityGroups: args.securityGroups,
				iamInstanceProfile: args.iamInstanceProfile
			};
		});
};

function runInstances(ec2, args) {
	const params = {
		ImageId: args.imageId,
		MaxCount: args.count,
		MinCount: args.count,
		IamInstanceProfile: {
			Arn: args.iamInstanceProfile
		},
		Monitoring: {
			Enabled: Boolean(args.monitoring)
		},
		InstanceType: args.instanceType,
		KeyName: args.keyName,
		SecurityGroupIds: args.securityGroups,
		EbsOptimized: Boolean(args.ebsOptimized),
		UserData: args.userData.toString('base64')
	};

	return new Promise((resolve, reject) => {
		ec2.runInstances(params, (err, res) => {
			if (err) {
				return reject(err);
			}
			resolve(res);
		});
	});
}

function createTags(ec2, args) {
	const params = {
		Resources: args.instances,
		Tags: args.tags.map(tag => {
			return {Key: tag.key, Value: tag.value};
		})
	};

	return new Promise((resolve, reject) => {
		ec2.createTags(params, (err, res) => {
			if (err) {
				return reject(err);
			}
			resolve(res);
		});
	});
}
