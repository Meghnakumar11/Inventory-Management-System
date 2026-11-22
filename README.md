# Assignment 3 - Inventory and Data Management System

Node.js + Express + MongoDB (Mongoose) + dotenv

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` (change `MONGO_URI` if needed)
3. Start MongoDB
4. `npm run seed`  (adds 12 sample products)
5. `npm start`  ->  http://localhost:5000

## API
| Method | URL | Description |
|---|---|---|
| POST | /api/products | Create product |
| GET | /api/products | All products (filter, sort, pagination) |
| GET | /api/products/:id | Single product |
| PUT | /api/products/:id | Update product details |
| PATCH | /api/products/:id/stock | `{ "change": 10 }` restock, `{ "change": -3 }` sale |
| DELETE | /api/products/:id | Delete product |
| GET | /api/products/low-stock | Products with quantity <= reorderLevel |
| GET | /api/products/summary | Category-wise inventory summary |

### Query params for GET /api/products
`category`, `supplier`, `search`, `minPrice`, `maxPrice`, `inStock=true|false`, `sort=price,-quantity`, `page`, `limit`

Example: `/api/products?category=Electronics&minPrice=500&sort=-price&page=1&limit=5`

### Sample POST body
```json
{ "name": "Gel Pen Pack of 15", "sku": "STNY-PN-713", "category": "Stationery",
  "price": 120, "quantity": 40, "reorderLevel": 20, "supplier": "Cello Pens" }
```
