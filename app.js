// BUilt In || Installed Modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

//changed

// Self Built Modules
const authRoute = require("./modules/auth");
const connectFriendsRoute = require("./modules/routes/connect");
const checkAuthStatus = require("./modules/checkAuthStatus");

// mongoose models
const User = require("./models/User");
const Friends = require("./models/Friends");
const WaitingConnect = require("./models/WaitingConnectRequests");

const app = express();

app.use("/", express.static("public"))
app.set("view engine", "ejs");
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(checkAuthStatus);


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("MongoDB Connection Failed: \n", err));

const mongooseClient = mongoose.connection.getClient();
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    name: "Socialite Authentication",
    cookie: {secure: false},
    store: MongoStore.create({
        client: mongooseClient,
        touchAfter: 24 * 3600,
        crypto: {
            secret: process.env.SESSION_SECRET,
        }
    }),
}));

app.get("/", async (req, res) => {
    if (req.isAuthenticated()){
        var loggedInUser = req.session.user;
        var users = await newArrForNewFriends(loggedInUser._id);
        res.render("index", {user: loggedInUser, users});
        return ;
    }
    res.redirect("/auth/login?from=" +  req.url);
});

// External Express Apps || Routes
app.use("/auth", authRoute);
app.use("/connect", connectFriendsRoute);

app.get("*", (req, res, next) => {
    res.send("404 Sorry you are in the wrong spot!");
});

const PORT = 3000;
app.listen(PORT, () => console.log("Web Server Up And Running!"));







// FUNCTIONS
async function newArrForNewFriends(userId){
    let usersArr = [];
    const addToArr = true;

    await User.find()
    .then(async (users, err) => {
        await Friends.find()
        .then(async (friends, err) => {
            await WaitingConnect.findOne({userId})
            .then((waitingConnect, err) => {
                var s = 0;
                for (const user of users){
                    for (const friend of friends){
                        if (user.id === friend.friends.friendId){
                            addToArr = false;
                            break;
                        }
                    }
                    if (addToArr === true){
                        usersArr.push({info: user});
                        let userArrLen = usersArr.length - 1;
                        for (const waitItOut of waitingConnect.waitingConnections){
                            if (waitItOut.userId === user.id){
                                usersArr[userArrLen].status = "NeedsYourAnswer";
                                break ;
                            }
                        }
                        for (const waitItOut of waitingConnect.requestedConnections){
                            if (usersArr[userArrLen].status != "NeedsYourAnswer" && waitItOut.userId === user.id){
                                usersArr[userArrLen].status = "YouAreWaiting"
                                break ;
                            }
                        }
                        if (usersArr[userArrLen].status != "YouAreWaiting" && usersArr[userArrLen].status != "NeedsYourAnswer"){
                            usersArr[userArrLen].status = "notKnown";
                        }
                    }
                    else
                        addToArr = true;
                }
            });
        });
    });
    return (usersArr);
}
