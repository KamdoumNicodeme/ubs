const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        image: {type: String, required: true},
        categories: {type: Array, required: true},
        size: {type: String},
        price: {type: Number},


    },
    {timestamps: true}
);


module.exports = mongoose.model("Product", ProductSchema);