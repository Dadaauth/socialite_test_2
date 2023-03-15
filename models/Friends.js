const mongoose = require('mongoose');

const friendsSchema = new mongoose.Schema({
    username: String,
    userId: String,
    friends: [{
        name: String,
        friendId: String,
        blocked: Boolean,
    }]
}, {timestamps: true});

module.exports = mongoose.model("Friends", friendsSchema);