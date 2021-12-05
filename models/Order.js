const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [
        {
            productId: {
                type: String
            },
            size: {
                type: String,
                required:true
            },
            color:{
                type:String,
                required:true
            },
            price:{
                type:Number,
                required:true
            }
        }
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" },
    chargeId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema)