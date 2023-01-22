# yt_api_fetch
An API to fetch latest videos from youtube sorted in reverse chronological order of their publishing date-time from YouTube for a given tag/search query in a paginated response.

The server fetches latest videos async after every 10 seconds and saves it to the db.

This project is completely based on Nodejs.

Requirements:

1. Express
2. MongoDb
3. Mongoose
4. Request promise and path

Setup Guide:
1. As this project is based on Nodejs, your system need to have proper Node setup.
2. Go the project through the terminal and install all dependencies by using typing npm install in the terminal
3. Fill your API key in the url API_KEY in the file app.js.
4. Run the server by the command: node app.js.