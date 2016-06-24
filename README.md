Odd Networks WWW
================
Odd Networks on the World Wide Web

Setup
-----
* Install [Node.js](https://nodejs.org/en/)
* Run `npm install`. Make sure this folder is your current working directory first.
* [Run tests](#testing) (see __Testing__ below)
* [Run the development server](#devserver) (see __Deverserver__ below)

Development
-----------
### Testing
Run tests with:

    npm test

Currently that will just run the XO linter.

### Devserver
Run the development server with

    npm run devserver

And watch the pretty output :-)

__!Warning:__ File changes to server-side JS files or template partials will require a server restart to take effect. Changes to view template files will not.

### CSS
There is a Sass build which can be run with

    npm run css

Configuration and Deployment
----------------------------
### Environment Variables
* `NODE_ENV=[development|staging|production]`
* `HOST=[127.0.0.1]`
* `PORT=[3000]`
* `LOG_LEVEL=[trace|debug|info|warn|error|fatal]`
* `OPBEAT_APP_ID=<app id>`
* `OPBEAT_ORGANIZATION_ID=<org id>`
* `OPBEAT_SECRET_TOKEN=<token>`

### Deployment is via AWS CodeDeploy
You'll need to [install the AWS command line tool](http://docs.aws.amazon.com/cli/latest/userguide/installing.html).

Copyright
---------
Copyright: (c) 2016 by Odd Networks.

All rights reserved.
