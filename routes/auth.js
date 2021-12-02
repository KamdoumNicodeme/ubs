const router = require("express").Router();
const User = require("../Models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");


// Register

router.post("/register", async (req, res) => {


    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(JSON.stringify(req.body.password), process.env.PASS_SECRET).toString()

    });

    try {
        const saverUser = await newUser.save();
        res.status(200).json(saverUser);
        console.log(saverUser)
    } catch (err) {
        res.status(500).json(err);
    }

});


//login

router.post("/login", async (req, res) => {


    try {
        const user = await User.findOne({username: req.body.username});
        if (!user) {
            return res.status(404).json(req.body.username + " Not found");
        }


        const bytes = CryptoJS.AES.decrypt(user.password, process.env.PASS_SECRET);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,

        },process.env.JWT_SECRET,
            {expiresIn: "3d"});
        //console.log(decryptedData);

        decryptedData !== req.body.password && res.status(401).json("wront credential");

        const {password, ...others} = user._doc;

        res.status(200).json({...others, accessToken});


    } catch (error) {
        res.status(500).json(error)
        console.log(error);
    }

})


module.exports = router;