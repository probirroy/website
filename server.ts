import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Product, Order } from "./src/types.js"; // In Node.js ES Modules, standard imports are used

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

// Ensure data folder and database.json exist
function initDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const initialProducts: Product[] = [
    {
      id: "prod-1",
      name: "Air Zoom Pro Running",
      brand: "Nike",
      description: "Experience maximum responsiveness and high-performance cushioning next door. A lightweight running shoe designed for daily runs and high-aerobic exercise.",
      price: 8999, // ₹8,999 Base price (equivalent to ~10,350 BDT)
      sizes: [7, 8, 9, 10, 11],
      category: "Running",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=650&q=80",
      stock: 15,
    },
    {
      id: "prod-2",
      name: "Retro Green Runner Classic",
      brand: "Adidas",
      description: "Timeless style meets modern energy-return technology. Built with sustainable primegreen upper and retro suede finish.",
      price: 7499, // ₹7,499
      sizes: [6, 7, 8, 9, 10, 11],
      category: "Casual",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=650&q=80",
      stock: 8,
    },
    {
      id: "prod-3",
      name: "Pastel Pop Street Sneaker",
      brand: "Puma",
      description: "Unmatched street aesthetic carrying robust comfort. Beautiful multi-color pastel blocking that stands out in any crowd.",
      price: 5999, // ₹5,999
      sizes: [7, 8, 9, 10],
      category: "Sneakers",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=650&q=80",
      stock: 20,
    },
    {
      id: "prod-4",
      name: "Heritage Leather Loafers",
      brand: "SoleStyle",
      description: "The epitome of smart-casual dressing. Premium tanned Italian leather with memory foam footbeds for day-long walking.",
      price: 4999, // ₹4,999
      sizes: [8, 9, 10, 11],
      category: "Casual",
      image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=650&q=80",
      stock: 12,
    },
    {
      id: "prod-5",
      name: "Tuxedo Classic Derby",
      brand: "Richards",
      description: "Exceptional craftsmanship for formal excellence. Real hand-colored calfskin and full-leather soles with double stiches.",
      price: 11999, // ₹11,999
      sizes: [8, 9, 10, 11, 12],
      category: "Formal",
      image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=650&q=80",
      stock: 5,
    },
    {
      id: "prod-6",
      name: "FlexRun Lightweight Stealth",
      brand: "Nike",
      description: "Engineered mesh offers natural agility. Designed with a flexible outsole pattern that adaptively structures with every footstrike.",
      price: 6999, // ₹6,999
      sizes: [7, 8, 9, 10, 11],
      category: "Running",
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=650&q=80",
      stock: 14,
    }
  ];

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify({ products: initialProducts, orders: [] }, null, 2),
      "utf8"
    );
  }
}

initDatabase();

function readData(): { products: Product[]; orders: Order[] } {
  try {
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database file", error);
    return { products: [], orders: [] };
  }
}

function writeData(data: { products: Product[]; orders: Order[] }) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing database file", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Authentication guard for Admin
  const requireAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (authHeader === "Bearer RAHUL-ADMIN-TOKEN-OK") {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized access: Admin login required." });
    }
  };

  // Auth endpoint
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "RAHULADMIN" && password === "123456") {
      res.json({ token: "RAHUL-ADMIN-TOKEN-OK", username: "RAHULADMIN" });
    } else {
      res.status(401).json({ error: "Invalid admin username or password" });
    }
  });

  // Get all products
  app.get("/api/products", (req, res) => {
    const data = readData();
    res.json(data.products);
  });

  // Add Product (CRUD)
  app.post("/api/products", requireAdminAuth, (req, res) => {
    const { name, brand, description, price, sizes, category, image, stock } = req.body;
    
    // Server validation
    if (!name || !brand || !description || isNaN(price) || !sizes || !category || !image || isNaN(stock)) {
      res.status(400).json({ error: "All product fields are required and must be valid." });
      return;
    }

    const data = readData();
    const newProduct: Product = {
      id: "prod-" + Date.now(),
      name,
      brand,
      description,
      price: Number(price),
      sizes: Array.isArray(sizes) ? sizes.map(Number) : [],
      category,
      image,
      stock: Number(stock)
    };

    data.products.push(newProduct);
    writeData(data);
    res.status(201).json(newProduct);
  });

  // Edit Product (CRUD)
  app.put("/api/products/:id", requireAdminAuth, (req, res) => {
    const productId = req.params.id;
    const { name, brand, description, price, sizes, category, image, stock } = req.body;

    const data = readData();
    const productIndex = data.products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Server-side parsing and updates
    data.products[productIndex] = {
      ...data.products[productIndex],
      name: name || data.products[productIndex].name,
      brand: brand || data.products[productIndex].brand,
      description: description || data.products[productIndex].description,
      price: price !== undefined ? Number(price) : data.products[productIndex].price,
      sizes: sizes !== undefined ? (Array.isArray(sizes) ? sizes.map(Number) : []) : data.products[productIndex].sizes,
      category: category || data.products[productIndex].category,
      image: image || data.products[productIndex].image,
      stock: stock !== undefined ? Number(stock) : data.products[productIndex].stock
    };

    writeData(data);
    res.json(data.products[productIndex]);
  });

  // Delete Product (CRUD)
  app.delete("/api/products/:id", requireAdminAuth, (req, res) => {
    const productId = req.params.id;
    const data = readData();
    const filteredProducts = data.products.filter((p) => p.id !== productId);

    if (filteredProducts.length === data.products.length) {
      res.status(404).json({ error: "Product not found." });
      return;
    }

    data.products = filteredProducts;
    writeData(data);
    res.json({ message: "Product deleted successfully." });
  });

  // Create Order and checkout (with dynamic stock reduction)
  app.post("/api/orders", (req, res) => {
    const { customerName, email, phone, address, city, country, paymentMethod, totalAmount, currency, items } = req.body;

    if (!customerName || !email || !phone || !address || !city || !country || !paymentMethod || !totalAmount || !currency || !items || items.length === 0) {
      res.status(400).json({ error: "Incomplete order specifications." });
      return;
    }

    const data = readData();

    // Verify stock and update inventory
    for (const item of items) {
      const product = data.products.find(p => p.id === item.productId);
      if (!product) {
        res.status(400).json({ error: `Product ${item.name} not found in store inventory.` });
        return;
      }
      if (product.stock < item.quantity) {
        res.status(400).json({ error: `Inadequate stock for ${product.name}. Selected: ${item.quantity}, Available: ${product.stock}` });
        return;
      }
    }

    // Deduct stock
    items.forEach((item: any) => {
      const product = data.products.find(p => p.id === item.productId);
      if (product) {
        product.stock -= item.quantity;
      }
    });

    const newOrder: Order = {
      id: "ord-" + Date.now(),
      customerName,
      email,
      phone,
      address,
      city,
      country,
      paymentMethod,
      totalAmount: Number(totalAmount),
      currency,
      status: "processing",
      items,
      createdAt: new Date().toISOString()
    };

    data.orders.push(newOrder);
    writeData(data);
    res.status(201).json(newOrder);
  });

  // Get Admin Portal Metrics
  app.get("/api/admin/metrics", requireAdminAuth, (req, res) => {
    const data = readData();
    let totalRevenueINR = 0;
    let totalRevenueBDT = 0;

    data.orders.forEach((ord) => {
      if (ord.currency === "INR") {
        totalRevenueINR += ord.totalAmount;
      } else {
        totalRevenueBDT += ord.totalAmount;
      }
    });

    res.json({
      totalRevenueINR,
      totalRevenueBDT,
      totalOrders: data.orders.length,
      totalProducts: data.products.length,
      orders: data.orders
    });
  });

  // Serve static assets or index.html fallback
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
