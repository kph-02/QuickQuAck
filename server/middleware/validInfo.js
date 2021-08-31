module.exports = (req, res, next) => {
    const {firstName, lastName, email, password, dob, college, gy} = req.body;


    //checks if email follows regular expression pattern
    function validEmail(userEmail){
        return /^\w+([\.-]?\w+)*@ucsd\.edu$/.test(userEmail);
    }

    function validPassword(userPassword) {
        return /^[a-zA-Z]{8,}$/.test(userPassword);
    }

    if (req.path === "/register"){
        if(![firstName, lastName, email, password, dob, college, gy].every(Boolean)){
            return res.status(401).json("Missing Credentials.");
        } 
        else if (!validEmail(email)){
            return res.status(401).json("Enter Valid UCSD Email");
        }
        else if (!validPassword(password)) {
            return res.status(401).json("Enter at least 8 characters");
        }
       
    }
    else if (req.path === "/login"){
        if (![email, password].every(Boolean)){
            return res.status(401).json("Incorrect Credentials.");
        }
        else if (!validEmail(email)){
            return res.status(401).json("Invalid Email");
        }
    }

    next();
};