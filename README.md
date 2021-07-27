# Instruction for set-up

## Setting up Dependencies

In order to install all of the dependencies, go into the `QQLogin` folder and run `npm ci`. Then, go into the `server` folder and run `npm ci`, followed by `npm ci dotenv`. This should allow you to run the app. If you receive errors at this point, it's most likely because a dependency did not get installed. Please either google the error or message others on slack to try and resolve it. Make sure to update everyone so if the problem arises again we know how to deal with it!

## Running The Program Locally

### Setting up PostgreSQL:

#### Download and install
[Download](https://www.postgresql.org/) the latest version of PostgreSQL. 

***NOTE:*** 
When installing PostgreSQL, make sure when asked to input a password, you make it password, which is what most people use, and will be used so that the server can talk to the server.

Then, navigate to the bin folder through a terminal (PostgreSQL will normally be downloaded inside of Program Files, after which you can navigate to PostgreSQL/(version number)/bin). To start the database as the postgres user, run `psql -U postgres`, and when prompted for a password, type `password` and press enter.

***NOTE:*** 
If psql isn't recognized as a command, it's possible that the registery of your device wasn't updated to include postgreSQL. Try [these](https://stackoverflow.com/questions/30401460/postgres-psql-not-recognized-as-an-internal-or-external-command) fixes. Don't forget to replace the paths with your own, especially the version number!

#### Initializing the database

Once you have logged in as the postgres user, navigate to `./sever/database.sql`. Copy the line `CREATE DATABASE Main;` and paste it into the terminal. This should create the initial database. Now, navigate into the database by doing `\c main`.

At this point, we will need the UUID extension. We can install this into the database by inputting `create extension if not exists "uuid-ossp";`

Finally, we need to setup the tables. Copy and paste the `CREATE TABLE` functions into the database in order to create them, and that should be the final step for setting up postgreSQL.

#### Navigating PostgreSQL

Some useful commands:

`\l`: list out the databases

`\dt`: list out the datatables

`\x on/off` Turn extended view mode on or off, useful for tables with lots of parameters

`SELECT * FROM (datatable);`: show all values within the datatable

`DELETE FROM (datatable);` deletes all values from within the datatable

### Setting up the server

Open a terminal and navigate to `*.\quickquack\server` and run `nodemon server`. This should start up the server on port 5000.

### Running the application

Navigate to `*.\quickquack\QQLogin` and run either `npm start` or `expo start`. This should open up a browser menu with a console on the screen alongside a menu on the left with things like a QR code you can scan.

### Viewing the application on a mobile device

Install the expo go app and make sure you are connected to the same internet network as the device hosting the application. Then, use your phone's camera to scan the QR code on the browser that opened, and this should begin initializing the package. Once complete, the app should begin running

### Notes on Expo

For the most part, the app will automatically refresh when you save any changes to files that the app is running. However, more often than not, the changes don't go into effect, so you will need to force refresh the application. For iOS devices, you can hold down with three finger to pull up a menu that will allow you to refresh the app.

Also, once you have opened the project once, you can just open the Expo Go app and will see your project under recent projects. You can just navigate to here and click on that while the host is running the application instead of scanning the QR code everytime.
