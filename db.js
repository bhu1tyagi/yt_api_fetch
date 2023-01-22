// we will connect to our MongoDB database and create a schema for our videos

const mongoose = require('mongoose');

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
videoSchema.index({ title: 'text', description: 'text' });
const Video = mongoose.model('Video', videoSchema);

Video.createIndexes({
    title: 'text',
    description: 'text'
});

module.exports = Video;
