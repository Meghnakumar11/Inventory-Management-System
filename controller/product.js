import Product from "../model/productModel.js"

const sortableFields = ['name', 'price', 'quantity', 'category', 'createdAt', 'updatedAt']

// small helper so user text cannot break the regex
const escapeRegex = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// POST /api/products
const createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body)

        res.status(201).json(product)

    } catch (error) {
        next(error)
    }
}

// GET /api/products?category=&supplier=&search=&minPrice=&maxPrice=&inStock=&sort=&page=&limit=
const getProducts = async (req, res, next) => {
    try {
        const { category, supplier, search, minPrice, maxPrice, inStock } = req.query

        // ---------- filtering ----------
        const filter = {}

        if (category) filter.category = new RegExp(`^${escapeRegex(category)}$`, 'i')
        if (supplier) filter.supplier = new RegExp(escapeRegex(supplier), 'i')
        if (search) filter.name = new RegExp(escapeRegex(search), 'i')

        if (minPrice || maxPrice) {
            filter.price = {}
            if (minPrice) filter.price.$gte = Number(minPrice)
            if (maxPrice) filter.price.$lte = Number(maxPrice)
        }

        if (inStock === 'true') filter.quantity = { $gt: 0 }
        if (inStock === 'false') filter.quantity = 0

        // ---------- sorting  (sort=price,-quantity) ----------
        let sort = '-createdAt'

        if (req.query.sort) {
            const fields = req.query.sort
                .split(',')
                .filter((f) => sortableFields.includes(f.replace('-', '')))

            if (fields.length > 0) sort = fields.join(' ')
        }

        // ---------- pagination ----------
        const page = Math.max(parseInt(req.query.page) || 1, 1)
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100)

        const total = await Product.countDocuments(filter)

        const products = await Product.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)

        res.status(200).json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            count: products.length,
            products
        })

    } catch (error) {
        next(error)
    }
}

// GET /api/products/:id
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({
                message: 'product not found',
                success: false
            })
        }

        res.status(200).json(product)

    } catch (error) {
        next(error)
    }
}

// PUT /api/products/:id
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: 'after',
            runValidators: true
        })

        if (!product) {
            return res.status(404).json({
                message: 'product not found',
                success: false
            })
        }

        res.status(200).json(product)

    } catch (error) {
        next(error)
    }
}

// PATCH /api/products/:id/stock     body : { "change" : 10 }  restock
//                                   body : { "change" : -3 }  sale
const adjustStock = async (req, res, next) => {
    try {
        const { change } = req.body || {}

        if (!Number.isInteger(change) || change === 0) {
            return res.status(400).json({
                message: '"change" must be a non-zero whole number (positive = restock, negative = sale)',
                success: false
            })
        }

        // for a sale, the filter makes sure quantity is enough, so stock never goes below 0
        // $inc is atomic, so two requests at the same time cannot break the stock
        const filter = { _id: req.params.id }

        if (change < 0) filter.quantity = { $gte: -change }

        const product = await Product.findOneAndUpdate(
            filter,
            { $inc: { quantity: change } },
            { returnDocument: 'after' }
        )

        if (!product) {
            const exists = await Product.exists({ _id: req.params.id })

            if (!exists) {
                return res.status(404).json({
                    message: 'product not found',
                    success: false
                })
            }

            return res.status(400).json({
                message: 'insufficient stock for this sale',
                success: false
            })
        }

        res.status(200).json({
            message: 'Stock updated',
            product
        })

    } catch (error) {
        next(error)
    }
}

// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)

        if (!product) {
            return res.status(404).json({
                message: 'product not found',
                success: false
            })
        }

        res.status(200).json({
            message: 'Product deleted',
            id: product.id
        })

    } catch (error) {
        next(error)
    }
}

// GET /api/products/low-stock      (quantity <= reorderLevel)
const getLowStock = async (req, res, next) => {
    try {
        const lowStockItems = await Product.aggregate([
            {
                $match: {
                    $expr: { $lte: ['$quantity', '$reorderLevel'] }
                }
            },
            {
                $addFields: {
                    stockValue: { $multiply: ['$price', '$quantity'] },
                    id: { $toString: '$_id' }
                }
            },
            {
                $sort: { quantity: 1 }
            }
        ])

        res.status(200).json({
            count: lowStockItems.length,
            lowStockItems
        })

    } catch (error) {
        next(error)
    }
}

// GET /api/products/summary        (category wise)
const getSummary = async (req, res, next) => {
    try {
        const summary = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    totalItems: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity' },
                    totalStockValue: { $sum: { $multiply: ['$price', '$quantity'] } },
                    avgPrice: { $avg: '$price' }
                }
            },
            {
                $sort: { totalStockValue: -1 }
            }
        ])

        res.status(200).json({
            categories: summary.length,
            summary
        })

    } catch (error) {
        next(error)
    }
}

export {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    adjustStock,
    deleteProduct,
    getLowStock,
    getSummary
}
