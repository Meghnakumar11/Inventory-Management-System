// run with : npm run seed      (deletes old products and adds 12 sample products)
import 'dotenv/config'
import mongoose from 'mongoose'
import Product from './model/productModel.js'

const products = [
    { name: 'Study Table', sku: 'FURN-TB-812', category: 'Furniture', price: 3999, quantity: 2, reorderLevel: 4, supplier: 'IKEA India' },
    { name: 'Office Chair', sku: 'FURN-CH-101', category: 'Furniture', price: 5499, quantity: 15, reorderLevel: 5, supplier: 'IKEA India' },
    { name: 'Laptop 15 inch', sku: 'ELEC-LP-001', category: 'Electronics', price: 55000, quantity: 8, reorderLevel: 3, supplier: 'Dell' },
    { name: 'Wireless Mouse', sku: 'ELEC-MS-022', category: 'Electronics', price: 799, quantity: 50, reorderLevel: 10, supplier: 'Logitech' },
    { name: 'Bluetooth Speaker', sku: 'ELEC-SP-033', category: 'Electronics', price: 2499, quantity: 3, reorderLevel: 5, supplier: 'boAt' },
    { name: 'Smartphone', sku: 'ELEC-PH-044', category: 'Electronics', price: 24999, quantity: 35, reorderLevel: 8, supplier: 'Samsung' },
    { name: 'Cotton T-Shirt', sku: 'APRL-TS-001', category: 'Apparel', price: 599, quantity: 60, reorderLevel: 20, supplier: 'Allen Solly' },
    { name: 'Denim Jeans', sku: 'APRL-JN-002', category: 'Apparel', price: 2199, quantity: 18, reorderLevel: 10, supplier: "Levi's" },
    { name: 'Gel Pen Pack of 10', sku: 'STNY-PN-010', category: 'Stationery', price: 120, quantity: 5, reorderLevel: 20, supplier: 'Cello Pens' },
    { name: 'A4 Notebook', sku: 'STNY-NB-011', category: 'Stationery', price: 80, quantity: 100, reorderLevel: 30, supplier: 'Classmate' },
    { name: 'Basmati Rice 5kg', sku: 'GROC-RC-001', category: 'Grocery', price: 650, quantity: 4, reorderLevel: 10, supplier: 'India Gate' },
    { name: 'Olive Oil 1L', sku: 'GROC-OL-002', category: 'Grocery', price: 899, quantity: 25, reorderLevel: 8, supplier: 'Figaro' }
]

try {
    await mongoose.connect(process.env.MONGO_URI)
    await Product.deleteMany({})
    await Product.insertMany(products)
    console.log('seeded 12 products')
} catch (error) {
    console.log(error)
} finally {
    await mongoose.disconnect()
}
