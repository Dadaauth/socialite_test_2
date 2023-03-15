const router = require("express").Router();
const mongoose = require("mongoose");

// mongoose models
const User = require("../../models/User");
const Friends = require("../../models/Friends");
const WaitingConnect = require("../../models/WaitingConnectRequests");



async function connect(user, to){

    let saveToRequester;
    let saveToReciever;
    //  ********************************
    // check if a request has already been
    // made to the server to connect a user
    // to make sure that it is not added to
    // the database twice as this will cause
    // a lot of problems.... 👇👇👇
    // ************************************


    async function checkIfExists(ownerId, foreignId, arrayPart){
        var rtnval = true;

        var found  = await WaitingConnect.findOne({userId: ownerId});
        if (found){
            await found[arrayPart].map((find) => {
                if (find.userId === foreignId)
                    rtnval = false;
            });
        }
        return (rtnval);
    }


    // for the requester
    // for the requester
    // for the requester
    saveToRequester = await checkIfExists(user, to, "requestedConnections");
    saveToRequester? saveToRequesterFUNC() : console.log("Already Sent Request!");
    function saveToRequesterFUNC(){
        WaitingConnect.findOneAndUpdate({userId: user}, {
            $push: {
                requestedConnections: [{
                    userId: to,
                }]
            }
        }).then(async (done, err) => {
            if (done){
                console.log("Friend Connected 1");
            }else {
                console.log("Error Connecting friend!" + err);
            }
        });
    }

    // // for the reciever
    // // for the reciever
    // // for the reciever
    saveToReciever = await checkIfExists(to, user, "waitingConnections");
    saveToReciever? saveToRecieverFUNC() : console.log("Reciever Already Has the request!");
    function saveToRecieverFUNC(){
        WaitingConnect.findOneAndUpdate({userId: to}, {
            $push: {
                waitingConnections: [{
                    userId: user,
                }],
            }
        }).then(async (done, err) => {
            if (done){
                console.log("Friend Connected 2");
            }else {
                console.log("Error Connecting friend!" + err);
            }
        });
    }
}


router.get("/", async (req, res) => {
    const user = req.query.user;
    const to = req.query.to;

    if (req.isAuthenticated()){
        await connect(user, to);
        res.redirect("/");
    } else {
        res.redirect("/auth/login?from=/connect" + req.url.slice(1)); // the "slice" function removes the first letter in the url, this is done to discard the "/" that comes first.
    }
});

router.get("/accept", (req, res) => {
    if (req.isAuthenticated()){
        res.send("You are trying to accept this connection!");
    } else {
        res.redirect("/auth/login?from=/connect" + req.url);
    }
});

module.exports = router;