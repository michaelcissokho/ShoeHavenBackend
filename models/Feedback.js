const mongoose = require("mongoose")

const FeedbackSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    comment:{type:String, required: true}
}, { timestamps: true });

module.exports = mongoose.model("Feedback", FeedbackSchema)