const AWS = require('aws-sdk');
const filepath = require('filepath');

const ec2 = new AWS.EC2({
	apiVersion: '2016-04-01',
	accessKeyId: '',
	secretAccessKey: '',
	region: ''
});

filepath.create().append('tools', 'aws-instance-setup.sh').read({encoding: null}).then(userData => {

	const args = {
		ImageId: '',
		MaxCount: 1,
		MinCount: 1,
		IamInstanceProfile: {
			Arn: ''
		},
		Monitoring: {
			Enabled: false
		},
		InstanceType: '',
		KeyName: '',
		SecurityGroupIds: [''],
		EbsOptimized: false,
		UserData: userData.toString('base64')
	};

	ec2.runInstances(args, (err, res) => {
		if (err) {
			console.log('ERROR: %s', err.message);
			console.log(err.stack);
		} else {
			console.log('RESPONSE');
			console.log(res);
		}
	});

}).catch(err => {
	console.log('file read error:');
	console.log(err.stack);
})
