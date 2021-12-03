const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");
const CryptoJS = require("crypto-js");
const router = require("express").Router();
const User = require("../Models/User");


//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    if (req.body.password) {

        req.body.password = CryptoJS.AES.encrypt(JSON.stringify(req.body.password), process.env.PASS_SECRET).toString();

    }
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updateUser);

    } catch (ex) {
        res.status(500).json(ex);
    }

});


//DELETE

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted");

    } catch (ex) {

        res.status(500).json(ex);
    }

});


//GET USER

router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const user = await User.findById(req.params.id)
        const {password, ...others} = user._doc;

        res.status(200).json({others});

    } catch (ex) {

        res.status(500).json(ex);
    }
});


// ALL USER

router.get("/", verifyTokenAndAdmin, async (req, res) => {

    const query = req.query.new;

    try {
        const users = query
            ? await User.find().sort({_id: -1}).limit(5)
            : await User.find();

        res.status(200).json({users});

    } catch (ex) {

        res.status(500).json(ex);
    }
});


//GET STATS USER


router.get("/stats", verifyTokenAndAdmin, async (req, res) => {

    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));


    try {

        const data = await User.aggregate([
            {$match: {createdAt: {$gte: lastYear}}},
            {
                $project: {
                    month: {$month: "$createdAt"},
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: 1}
                }
            }

        ]);
        res.status(200).json(data)

    } catch (ex) {
        res.status(500).json(ex);
    }

});

module.exports = router;