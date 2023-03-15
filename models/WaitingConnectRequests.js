const mongoose = require("mongoose");

const waitingConnectSchema = new mongoose.Schema({
    username: String,
    userId: String,
    waitingConnections: [{
        userId: String,
    }],
    requestedConnections: [{
        userId: String,
    }],
}, {timestamps: true});

module.exports = mongoose.model("WaitingConnect", waitingConnectSchema);