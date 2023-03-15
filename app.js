// BUilt In || Installed Modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
require("dotenv").config();


const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


const PORT = 3000;
app.listen(PORT, () => console.log("Web Server Up And Running!"));