const express = require('express');
const request = require('request-promise');
const async = require('async');
const Video = require('./db');

const app = express();
const PORT = 3000;

const API_KEY = 'YOUR_API_KEY';
const API_URL = 'https://www.googleapis.com/youtube/v3/search';

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

