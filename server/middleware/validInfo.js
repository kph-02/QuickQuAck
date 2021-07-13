module.exports = (req, res, next) => {
    const {firstName, lastName, email, password, dob, college, gy} = req.body;


    //checks if email follows regular expression pattern
    function validEmail(userEmail){
        return /^\w+([\.-]?\w+)*@\w+([\.-]\w+)*(\.\w{2,3})+$/.test(userEmail);
    }

    if (req.path === "/register"){
        if(![firstName, lastName, email, password, dob, college, gy].every(Boolean)){
            return res.status(401).json("Missing Credentials");
        } 
        else if (!validEmail(email)){
            return res.status(401).json("Invalid Email");
        }
    }
    else if (req.path === "/login"){
        if (![email, password].every(Boolean)){
            return res.status(401).json("Missing Credentials");
        }
        else if (!validEmail(email)){
            return res.status(401).json("Invalid Email");
        }
    }

    next();
};