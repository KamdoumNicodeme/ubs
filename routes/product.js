const router = require("express").Router();
const { verifyTokenAndAdmin} = require("./verifyToken");
const Product = require("../Models/Product");

//CREATE

router.post("/",verifyTokenAndAdmin,async (req,res)=>{

    const newProduct = new  Product(req.body);

    try {
        const saveProduct = await newProduct.save();
        res.status(200).json(saveProduct);
    }catch (err){
        res.status(500).json(err);
    }

});



//UPDATE

router.put("/:id",verifyTokenAndAdmin,async (req, res) => {

    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{

            $set: req.body
        },{new:true});

        res.status(200).json(updatedProduct);
    }catch (err){
        res.status(500).json(err);
    }

});



//DELETE


router.delete("/:id",verifyTokenAndAdmin, async (req, res) => {

    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted");

    } catch (ex) {

        res.status(500).json(ex);
    }
});



//GET PRODUCT


router.get("/find/:id",verifyTokenAndAdmin, (req, res)=>{

    try {
        const product = Product.findById(req.params.id);

        res.status(200).json(product);
    }catch (err){
        res.status(500).json(err);
    }
});



//GET ALL PRODUCT


router.get("/",verifyTokenAndAdmin, async (req, res) => {


    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});





module.exports = router;