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

This will run the server with [Nodemon](https://github.com/remy/nodemon) so that it will automatically restart when you make changes to the Node.js source files and template partials.

__!Warning:__ File changes to server-side JS files or template partials will require a server restart to take effect. Changes to view template files will not.

### CSS
There is a Sass build which can be run with

    npm run css

During development it is handy to run the CSS build tool with a file watcher so that the Sass is automatically built when their are file changes. You can do this with

    npm run watch-css

Configuration and Deployment
----------------------------
### Environment Variables
Find a list of environment variables in `.env-example`. Copy that to `.env` in you local clone of the project and fill them in appropriately.

### Deployment is via AWS CodeDeploy
To deploy you'll need to have

    .deploy-env

in place. Copy it over from `.deploy-env-example` and fill in the values.

Copyright
---------
Copyright: (c) 2016 by Odd Networks.

All rights reserved.
