# Linker

Beautiful UI & UX Link Shortner Web App with Link Analytics and User account/authentication system.

There are a lot of link shorteners already on the internet like bitly, but what makes it different is that it can be self hosted. You own the server, database, and basically the whole control of the application. *You no longer have to use the bit.ly/random stuff now, you can create your own server, with the domain name of your choice, just like [go.ansh.live](https://go.ansh.live)

Highlights:
- The webapp is completely responsive/cross-platform.
- It contains analytics for the link clicks.
- Users can create account, or sign-in via Google.
- It supports custom alias and 62 bit hashing.
- 62 bit hashing is implemented with O(1) CRUD operation for faster performance.

## Installation

Please refer to the [installation docs here](https://github.com/anshgoyalevil/Linker/blob/master/installation.md).

## How to start contributing to this project?

The Linker project is built by the community for the community. We welcome contributions from everyone, especially new contributors.

You can help with Linker's development in many ways, including art, coding, design and documentation.

Developers: please [see this wiki page](https://github.com/anshgoyalevil/Linker/blob/master/installation.md) for instructions on how to set things up and commit changes.
All other contributors: please see our [general contributor guidelines](https://github.com/anshgoyalevil/Linker/blob/master/contribution.md).

## Check out some [screenshots of the application here](https://github.com/anshgoyalevil/Linker/blob/master/preview.md)

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
