import mongoose from "mongoose";

// checks that :id in the URL is a valid MongoDB ObjectId
const validateId = (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            message: 'invalid product id',
            success: false
        })
    }
    next()
}

export default validateId
