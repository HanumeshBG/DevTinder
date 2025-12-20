const validator = require('validator');


const validateSignupData = (req) => {
    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("First name and Last name are required");
    }else if(firstName.length < 4 || firstName.length > 50){
        throw new Error("First name must be between 4 and 50 characters");
    }else if(!validator.isEmail(email)){
        throw new Error("Invalid email address");
    } else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }

}

module.exports = {
    validateSignupData
}