const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/youtube_videos', { useNewUrlParser: true });

const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    publishedAt: Date,
    thumbnails: {
        default: {
            url: String,
            width: Number,
            height: Number
        },
        medium: {
            url: String,
            width: Number,
            height: Number
        },
        high: {
            url: String,
            width: Number,
            height: Number
        }
    }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
