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

    npm run dev

This will run the server (and local Dynamo DB server) with [Nodemon](https://github.com/remy/nodemon) so that it will automatically restart when you make changes to the Node.js source files and template partials.

### CSS
There is a Sass build which can be run with

    npm run css

During development it is handy to run the CSS build tool with a file watcher so that the Sass is automatically built when their are file changes. You can do this with

    npm run watch-css

Database
--------
The website uses Amazon DynamoDB as its database. For local development it uses a "fake" DynamoDB server called [Dynalite](https://github.com/mhart/dynalite). When testing, this server is run using memory as the store. In development mode it uses LevelDB and stores the data files in our `data/` directory. Some supported database shortcuts are provided:

    npm run db-migrate
    npm run db-run # Runs the DB server alone
    npm run dev # Runs the DB and Express.js servers together
    npm run db-clean

Database Seeding
----------------
Database seed files are stored in `seeds/`. The seed script to seed the datbase can be run with:

    npm run db-clean
    npm run db-migrate
    npm run db-seed

All three of those commnds must be run in that order to successfully seed the database. A shortcut would be

    npm run db-clean && npm run db-migrate && npm run db-seed

Debug Logger
------------
The [debug module](https://github.com/visionmedia/debug) is used throughout the project. Check out the `DEBUG` env variable and the [documentation](https://github.com/visionmedia/debug).

Configuration and Deployment
----------------------------
### Environment Variables
Find a list of environment variables in `.env-example`. Copy that to `.env` in you local clone of the project and fill them in appropriately.

Copyright
---------
Copyright: (c) 2016 by Odd Networks.

All rights reserved.
