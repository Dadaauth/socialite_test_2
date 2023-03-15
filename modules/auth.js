





/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/

/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/

/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/

/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/

/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/
/******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************//******************************  TRYING TO SEPERATE THE FUNCTIONNS ********************************/













/******************* *******************/
// installed modules
const router = require("express").Router();
const bcrypt = require("bcrypt");
require("dotenv").config();
// self made modules
const User = require("../models/User");
const Password = require("../models/Passwords");
const WaitingConnect = require("../models/WaitingConnectRequests");
const passwordValidate = require("./passwordStyle");
/****************** *********************/



/****************** *********************/
router.get("/login", (req, res) => {
    if (req.isAuthenticated()){
        res.redirect("/");
        return;
    }
    res.render("login");
});
/***************** *********************/


/***************** ********************/
router.get("/register", (req, res) => {
    if (req.isAuthenticated()){
        res.redirect("/");
        return; 
    }
    res.render("register");
});
/**************** ********************/


/**************** *******************/
router.get("/logout", (req, res) => {
    req.session.user = null;
    if (typeof(req.query.from !== "undefined"))
        res.redirect("/auth/login?from=" + req.query.from);
    else
        res.redirect("/auth/login?from=/");
});
/**************** *******************/


/*************** *********************/
router.post("/login", (req, res) => {

    if (req.isAuthenticated())
    {
        res.redirect("/");
        return;
    }
    const email = req.body.email;
    const password = req.body.password;
    if (email == "" || password == "")
    {
        res.render("login", {emptyFields: true});
        return;
    }
    // USER VERIFICATION SECTION START :::::::::::::::: USER
    // find the user in the database
    User.findOne({email: email})
    .then((found, err) => {
        if (found) {
            Password.findOne({userEmail: email})
            .then((foundP, err) => {
                if (foundP){
                    bcrypt.compare(password, foundP.password, (err, same) => {
                        if (same)
                        {
                            saveUserSession();
                            logUserIn();
                        }
                        else
                        {
                            // password is not correct
                            res.render('login', {passwordWrong: true});
                            return;
                        }
                    });
                }else{
                    res.render('login', {userUnknown: true, passwordWrong: true});
                    console.log("User/Password not found: \n" + err);
                    return;
                }
            });
        }
        else{
            // user doesn't exist, redirect back to login page
            res.render('login', {userUnknown: true});
            console.log("User not found: \n" + err);
            return;
        }
    })
    .catch((err) => {
        res.render('login', {loginError: true});
        return ;
    });
    // USER VERIFICATION SECTION END :::::::::::::::: USER

    // LOG USER IN
    async function saveUserSession()
    {
        // req.session.regenerate();

        await User.findOne({email: email})
        .then((found, err) => {
            req.session.user = found;
        })
        .catch(() => {
            res.render('login', {loginError: true});
            return ;
        });


        await req.session.save((err) => {
            if (err){
                res.render('login', {loginError: true});
                return ;
            }
            console.log("Session Saved!!")
        });
    }
    function logUserIn()
    {
        res.redirect("/");
    }
});
/****************** *******************/




/****************** *******************/
router.post("/register", async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    if (username == "" || email == "" || password == ""){
        res.render("register", {emptyFields: true});
        return;
    }
    /**
     * check if password meets the requirements in passwordStyle.js
     * REQUIREMENTS::::::::::::::
     * (1)length greater than 8
     * (2)must contain Uppercase letters
     * (3)must contain Lowercase letters
     * (4)must contain numbers
     * (5)must contain special characters
     */
    const options =  {
        passwordLength: true,
        uppercaseLetters: true,
        lowercaseLetters: true,
        numbers: true,
        specialCharacters: true,
        minPasswordLength: 8,
        maxPasswordLength: 20,
        default: true,
    };

    passwordValidate(password, options, async (validateState, falseArray) => {
        if (validateState) {
            console.log("Password validated!");
            await saveNewUser();
            saveOtherEssentialUserInfo();
        }
        else {
            console.log("Check your password!\n");
            res.render("register", {userInputError: falseArray});
            falseArray.map((falsemsg) => {
                console.log(falsemsg + "\n");
            });
            return;
        }
        // end of function
    });
    async function saveNewUser()
    {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
        });
        const message = "Registration Successfull! Please Login..."
        await user.save()
        .then(() => {
            User.findOne({email: email})
            .then(async (user, err) => {
                if (user){
                    const password = new Password({
                        password: hashedPassword,
                        userEmail: email,
                        userId: user.id,
                    });
                    await password.save();
                    return ;
                }
                res.render("register", {signupError: true}); 
                console.log(err)
            });
            res.render("login", {message});
        })
        .catch((err) => {
            res.render("register", {signupError: true}); 
            console.log(err)
        });
        // end of function
    }
    async function saveOtherEssentialUserInfo(){
        User.findOne({email})
        .then(async (details, err) => {
            const waitingconnect = new WaitingConnect({
                username: details.username,
                userId: details.id,
                waitingConnections: [{}],
            });
            await waitingconnect.save();
        });
    }
    // end of function register
});
/***************** ******************/


/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/***** REGISTER POST ROUTE START *****/

    function findUserInDatabase(){

    }
/***** REGISTER POST ROUTE END *******/
/***** LOGIN POST ROUTE START ********/

/***** LOGIN POST ROUTE END **********/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
/************* FUNCTIONS ************/
module.exports = router;