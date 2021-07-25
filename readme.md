# SHELA..

* Steps to `To Run Project`

1. run `npm install` to install dependencies
2. set node version - nvm use v9.8.0
3. run `node bin/server.js` to start server

By default enviroment is set to config/default.json
To change the environment run "" export NODE_ENV=production "" before starting the server.

Hapi server will start on localhost:3000
Mongo will also start on localhost

Use of each folder -    

Assets - To store all the images
Bin - Server file is defined here
Components - All the main components to be used. Models , routes , services is defined here
Config - Basic configration of the project
Processor - Defining the values to be passed to the email template.
Providers - Third parties to be used like - smtp
Settings - body of modules for configration is defined.
Templates - Email templtes body
Utils - common fucntions defined here
