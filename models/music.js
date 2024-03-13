const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Genre"
  },
  duration: {
    type: String,
    required: true
  },
  path: {
    type: String,
    default: ""
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mimetype: String
}, {
    timestamps: true
});

const Music = mongoose.model('Music', musicSchema);

module.exports = Music;