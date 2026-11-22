import 'dotenv/config'
import express from 'express'
import connectDB from './database/mongodb.js'
import productRouter from './routes/productRoutes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const app = express()

connectDB()

app.use(express.json())

app.use('/api/products', productRouter)

app.use(notFound)

app.use(errorHandler)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log('server has started at port : ', port)
})
