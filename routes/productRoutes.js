import express from "express";
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    adjustStock,
    deleteProduct,
    getLowStock,
    getSummary
} from "../controller/product.js";
import validateId from "../middleware/validateId.js";

const productRouter = express.Router()

productRouter.post('/', createProduct)

productRouter.get('/', getProducts)

// NOTE : /low-stock and /summary must be above /:id, otherwise express treats them as an id
productRouter.get('/low-stock', getLowStock)

productRouter.get('/summary', getSummary)

productRouter.get('/:id', validateId, getProductById)

productRouter.put('/:id', validateId, updateProduct)

productRouter.patch('/:id/stock', validateId, adjustStock)

productRouter.delete('/:id', validateId, deleteProduct)

export default productRouter
