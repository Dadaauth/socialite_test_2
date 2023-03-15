
function passwordValidate(password, options, callback)
{
    // prototype  passwordValidate(password, options, callback)

    // length greater than 8
    // length less than options.minPasswordLength
    // must contain Uppercase letters
    // must contain Lowercase letters
    // must contain numbers
    // must contain special characters
    /**
     * validating programmer inputs
     */
    if (typeof options == "undefined" || typeof options != "object")
        throw new Error("Options arguement is not defined or is not of type object...");
    if (typeof password == "undefined" || typeof password != "string")
        throw new Error("password arguement is not defined or is not of type string...");
    if (typeof callback == "undefined" || typeof callback != "function")
        throw new Error("callback is not defined or is not of type function...");
    if (typeof options.minPasswordLength == "undefined")
        options.minPasswordLength = 1;
    if (typeof options.maxPasswordLength == "undefined")
        options.maxPasswordLength = 3000;
    if (options.minPasswordLength > options.maxPasswordLength)
        throw new Error("minimum password length cannot be greater than max password length...");

    /**
     * validating user inputs
     */
    const falseArray = [];
    if((options.passwordLength || options.default) && (password.length < options.minPasswordLength || password.length > options.maxPasswordLength))
        falseArray.push("Password length must be greater than " + options.minPasswordLength + " and less than " + options.maxPasswordLength + "!");
    if((options.uppercaseLetters || options.default) && password.match(/[A-Z]/) == null)
        falseArray.push("Password must contain at least one uppercase letter!");
    if((options.lowercaseLetters || options.default) && password.match(/[a-z]/) == null)
        falseArray.push("Password must contain at least one lowercase letter!");
    if((options.numbers || options.default) && password.match(/[0-9]/) == null)
        falseArray.push("Password must contain at least one number!");
    if((options.specialCharacters || options.default) && password.match(/[!@#$%^&*?]/) == null)
        falseArray.push("Password must contain at least one special character(!@#$%^&*?)!");
    if(falseArray.length > 0)
    {
        callback(false, falseArray);
        return;
    }
    callback(true, falseArray);
}


module.exports = passwordValidate;