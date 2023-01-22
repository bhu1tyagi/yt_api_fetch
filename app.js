//import all the necessary libraries and files
const express = require('express');
const request = require('request-promise');
const async = require('async');
const Video = require('./db');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

const API_KEY = 'AIzaSyCzI3UQPHd3CE3yu4IjHDSU2fkGseBGrTc';
const API_URL = 'https://www.googleapis.com/youtube/v3/search';

//mongodb database connection setup by using mongoose
async function connect() {
    try {
      const url = 'mongodb+srv://bhu1tyagi:Tyagi%401234@youtubevideos.isvyiho.mongodb.net/?retryWrites=true&w=majority' || 'mongodb://127.0.0.1:27017/youtubevideos';
      await mongoose.connect(url, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
      console.log('Connected to \x1b[32mDatabase\x1b[0m');
      return 0;
    } catch (err) {
      console.log('ERROR: Could not connect to database: ', err);
      process.exit(1);
    }
}
connect();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//get API to get videos by using API_URL and API_URL
app.get('/videos', (req, res) => {
    const searchQuery = req.query.q;
    const pageToken = req.query.pageToken;

    const options = {
        method: 'GET',
        uri: API_URL,
        qs: {
            part: 'snippet',
            q: searchQuery,
            pageToken: pageToken,
            type: 'video',
            key: API_KEY
        },
        json: true
    };

    request(options)
        .then(data => {
            async.each(data.items, (item, callback) => {
                const videoData = {
                    title: item.snippet.title,
                    description: item.snippet.description,
                    publishedAt: item.snippet.publishedAt,
                    thumbnails: item.snippet.thumbnails
                };

                const video = new Video(videoData);
                video.save(callback);
            }, err => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Videos saved to database.');
                }
            });
            res.json(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Failed to fetch videos from YouTube API.' });
        });
});

//API to get the stored data in paginated response
app.get('/videos/stored', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    Video.find({})
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec((err, videos) => {
            if (err) {
                res.status(500).json({ error: 'Failed to fetch stored videos from database.' });
            } else {
                res.json(videos);
            }
        });
});

//Dashboard API
app.get('/dashboard', (req, res) => {
    Video.find({}, (err, videos) => {
        if (err) {
            res.status(500).json({ error: 'Failed to fetch stored videos from database.' });
        } else {
            res.render('dashboard', { videos: videos });
        }
    });
});

//search API to search the stored videos using their title and description
app.get('/videos/search', (req, res) => {
    const searchQuery = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    Video.find({ $text: { $search: searchQuery } }, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" }, publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec((err, videos) => {
            if (err) {
                res.status(500).json({ error: 'Failed to search for videos in database.' });
            } else {
                res.json(videos);
            }
        });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

