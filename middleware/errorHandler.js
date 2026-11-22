// 404 for unknown routes
const notFound = (req, res, next) => {
    res.status(404).json({
        message: `route not found : ${req.method} ${req.originalUrl}`,
        success: false
    })
}

// centralized error handler - every controller sends errors here using next(error)
const errorHandler = (error, req, res, next) => {
    let status = error.statusCode || 500
    let message = error.message || 'internal server error'
    let errors

    if (error.name === 'ValidationError') {
        status = 400
        message = 'validation failed'
        errors = Object.values(error.errors).map((e) => e.message)

    } else if (error.name === 'CastError') {
        status = 400
        message = `invalid value for ${error.path}`

    } else if (error.code === 11000) {
        status = 409
        const field = Object.keys(error.keyValue)[0]
        message = `${field} '${error.keyValue[field]}' already exists`

    } else if (error.type === 'entity.parse.failed') {
        status = 400
        message = 'invalid JSON body'
    }

    res.status(status).json({
        message,
        success: false,
        ...(errors && { errors })
    })
}

export { notFound, errorHandler }
