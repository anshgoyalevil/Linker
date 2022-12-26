# Linker

Beautiful UI & UX Link Shortner Web App with Link Analytics and User account/authentication system.

Highlights:
- The webapp is completely responsive/cross-platform.
- It contains analytics for the link clicks.
- Users can create account, or sign-in via Google.
- It supports custom alias and 62 bit hashing.
- 62 bit hashing is implemented with O(1) CRUD operation for faster performance.

## Frontend Technologies Used:-
- HTML
- CSS
- JavaScript
- Flowbite
- Tailwind
- Font Awesome
- EJS

## Backend Technologies Used:-
- Node.JS
- Express.JS

## Database Technology Used:-
- MongoDB

Following Node Modules are used:
- dotenv - for securing api keys
- express - for server side logic
- body-parser - for parsing the body data
- mongoose - for using mongodb effeciently
- express-session - for cookie sessions
- passport - for authentication
- passport-local-mongoose - passport plugin for mongoose
- passport-google-oauth20 - passport auth strategy for google authentication
- mongoose-findorcreate - a utility mongoose function
- http - to handle http requests and server

## How to test the app?

Download the project or git clone it into your local machine.

Inside the Project Folder, Create a file named .env and assign the following values in it:
```
SECRET=anyrandomstring
CLIENT_ID=google auth 2.0 cliend id
CLIENT_SECRET=google auth 2.0 client secret
API_KEY=api key from deepai.com
DB_URI=mongodb database uri
```

Inside the project terminal, 
- run: ```npm install```
- after the above command is executed, run ```node index.js```
- now, open up a browser window, and type ```127.0.0.1:3000``` to test the application.

Congrats, you are ready to test this web application into your local machine.

Feel free to fork it, star it, or send pull requests.
