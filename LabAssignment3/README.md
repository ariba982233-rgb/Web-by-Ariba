# Assignment 3 – Dynamic Product Catalog

Bonanza Satrangi e-commerce app with MongoDB, server-side pagination, filtering, and sorting.

## 📁 Folder Structure
```
Assignment3/
├── models/
│   └── Product.js        # Mongoose schema
├── public/
│   ├── css/
│   │   ├── style.css     # Global styles
│   │   ├── products.css  # Products page styles
│   │   └── cart.css      # Cart page styles
│   ├── images/           # Product images (copied from Labtask2)
│   └── js/
│       ├── script.js     # Global JS (hamburger, filters)
│       └── products.js   # Products page JS
├── views/
│   ├── homepage.ejs      # Home page
│   ├── products.ejs      # Product catalog page
│   ├── cart.ejs          # Shopping cart page
│   └── contact-us.ejs    # Contact page
├── seed.js               # Database seeder (30 products)
├── server.js             # Express server
└── package.json
```

## 🚀 Setup & Run

### Prerequisites
- Node.js installed
- MongoDB installed and running locally, **OR** a MongoDB Atlas URI

### Step 1 — Install Dependencies
```bash
node -e "require('child_process').execSync('npm install', {cwd: process.cwd(), stdio: 'inherit'})"
```
Or open terminal in the folder and run `npm install`.

### Step 2 — Start MongoDB
```bash
# Start MongoDB locally (Windows)
mongod --dbpath "C:\data\db"
```

### Step 3 — Seed the Database
```bash
node seed.js
```
This inserts **30 sample products** (14 dresses, 8 perfumes, 8 beauty).

### Step 4 — Start the Server
```bash
node server.js
```

### Step 5 — Open in Browser
- Home:     http://localhost:3001/
- Products: http://localhost:3001/products
- Cart:     http://localhost:3001/cart

---

## ✅ Features

| Feature | Details |
|---------|---------|
| **Database** | Mongoose schema with `name`, `price`, `category`, `rating`, `stock`, `image`, `description` |
| **Seeding** | 30 products across 3 categories |
| **Pagination** | 8 per page, `?page=n` query param, page number buttons |
| **Search** | Filter by name (debounced, case-insensitive regex) |
| **Category Filter** | Chip UI — dress / perfume / beauty / all |
| **Price Range** | Min/max price inputs |
| **Sorting** | Latest, Price ↑, Price ↓, Top Rated, Name A–Z |
| **Add to Cart** | POST /cart/add with quantity tracking |
| **Cart Page** | Item list, subtotals, free shipping logic |

## 🌐 MongoDB Atlas (Cloud) Alternative
Set the `MONGO_URI` environment variable before starting:
```powershell
$env:MONGO_URI = "mongodb+srv://<user>:<pass>@cluster.mongodb.net/bonanza_satrangi"
node seed.js
node server.js
```
