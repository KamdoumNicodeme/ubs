const router = require("express").Router();
const { verifyTokenAndAdmin, verifyToken, verifyTokenAndAuthorization} = require("./verifyToken");
const Cart = require("../Models/Cart");

//CREATE

router.post("/",verifyToken,async (req,res)=>{

    const newCart = new  Cart(req.body);

    try {
        const saveCart = await newCart.save();
        res.status(200).json(saveCart);
    }catch (err){
        res.status(500).json(err);
    }

});



//UPDATE

router.put("/:id",verifyTokenAndAuthorization,async (req, res) => {

    try{
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id,{

            $set: req.body
        },{new:true});

        res.status(200).json(updatedCart);
    }catch (err){
        res.status(500).json(err);
    }

});



//DELETE


router.delete("/:id",verifyTokenAndAuthorization, async (req, res) => {

    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("cart has been deleted");

    } catch (ex) {

        res.status(500).json(ex);
    }
});



//GET USER CART


router.get("/find/:userId",verifyTokenAndAuthorization, (req, res)=>{

    try {
        const cart = Cart.findOne({userId: req.params.userId});

        res.status(200).json(cart);
    }catch (err){
        res.status(500).json(err);
    }
});



//GET ALL


router.get("/",verifyTokenAndAdmin,async (req,res)=>{

    try{
        const cart = await Cart.find();
        res.status(200).json(cart);


    }catch (err){
        res.status(500).json(err);
    }
});





module.exports = router;