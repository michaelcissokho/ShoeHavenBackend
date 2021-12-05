const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true, unique: true },
    img: { type: String, required: true },
    categories: { type: Array },
    sizes: { type: Array },
    colors: { type: Array },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    stripeProductId: { type: String, required: true },
    stripePriceId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema)