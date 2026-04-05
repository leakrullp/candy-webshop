const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}\n
  See all products on http://localhost:${PORT}/api/categories\n
  See all products with current price on http://localhost:${PORT}/api/products\n
  See basket for a specific customer on http://localhost:${PORT}/api/baskets/1`);
}); 

// Health check endpoint
app.get('/status', (req, res) => {
  res.send('Server is running');
});

// Root endpoint to serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
const publicPath = path.join(__dirname); //Path to static files
app.use(express.static(publicPath)); // Serve static files from the public directory
const dataPath = path.join(__dirname, "data.json");


// HELPER FUNCTIONS

// Read ALL data from JSON file
const getData = () => {
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
};

// Write data to JSON file
const saveData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Normalize names for consistent matching
const normalizeName = (value) => value.trim().toLowerCase();

// Create unique customer ID from first and last name
const createCustomerId = (firstName, lastName) => {
  return `${normalizeName(firstName)}-${normalizeName(lastName)}`;
};

// Get products with the current price after applying discount
function getCurrentPrice(product) {
  const { originalPrice, discount } = product;
  if (discount > 0) {
    return originalPrice - originalPrice * (discount / 100);
  }
  return originalPrice;
}


//PRODUCTS

// GET all products with current price
app.get("/api/products", (req, res) => {
  const data = getData();

  const productsWithPrice = data.products.map((p) => ({
    ...p,
    price: getCurrentPrice(p),
  }));

  res.json({ products: productsWithPrice });
});


// GET product by ID
app.get('/api/products/:id', (req, res) => {
  const data = getData();

  const product = data.products.find(p => p.id === parseInt(req.params.id));

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});


// GET product categories
app.get("/api/categories", (req, res) => {
  const data = getData();

  const categories = [...new Set(data.products.map((p) => p.category))];
  res.json({ categories });
});


// GET products by category
app.get("/api/categories/:category", (req, res) => {
  const data = getData();

  const products = data.products.filter(
    (p) => p.category.toLowerCase() === req.params.category.toLowerCase()
  );

  res.json({ products });
});


//CUSTOMERS

// Create a new customer
app.post('/api/customers', (req, res) => {
  const { firstName, lastName } = req.body;
  const data = getData();

  if (!firstName || !lastName) {
    return res.status(400).json({ message: 'firstName and lastName are required' });
  }

  let customerId = createCustomerId(firstName, lastName);
  let suffix = 1;
  while (data.customers.find(c => c.id === customerId)) {
    customerId = `${customerId}-${suffix++}`; // Ensure unique ID
  }

  const newCustomer = {
    id: customerId,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    createdAt: new Date().toISOString(),
  };

  data.customers.push(newCustomer);
  saveData(data);

  res.status(201).json({ message: 'Customer created', customer: newCustomer });
});


// Login 
app.post('/api/customers/login', (req, res) => {
  const { firstName, lastName } = req.body;
  const data = getData();
  const customer = data.customers.find(c => normalizeName(c.firstName) === normalizeName(firstName) && normalizeName(c.lastName) === normalizeName(lastName));

  if (!customer) {
    return res.status(400).json({ message: 'Customer not found' });
  }

  res.json({ customer });
});


// BASKETS

// Create or get existing basket for a customer
app.post('/api/baskets/:customerId',(req, res) => {
  const data = getData();

  const existing = data.baskets.find(
    (b) => b.customerId === req.params.customerId
  );

  if (existing) {
    return res.json({ message: "Basket already exists", basket: existing });
  }

  const newBasket = {
    customerId: req.params.customerId,
    items: []
  };

  data.baskets.push(newBasket);
  saveData(data);

  res.status(201).json({ message: 'Basket created', basket: newBasket });
});


// GET basket for a specific customer
app.get("/api/baskets/:customerId", (req, res) => {
    const data = getData();
  
    const basket = data.baskets.find((b) => b.customerId === req.params.customerId);
  
    if (!basket) {
      return res.status(404).json({ message: "No basket for this customer" });
    }

    res.json({ basket });
  });


// Add item to basket
app.post('/api/baskets/:customerId/items', (req, res) => {
  const { productId, quantity } = req.body;
  const data = getData();

  const basket = data.baskets.find(b => b.customerId === req.params.customerId);

  if (!basket) {
    return res.status(404).json({ message: 'Basket not found' });
  }

  const item = basket.items.find(i => i.productId === productId);

  if (item) {
    item.quantity += quantity; // Increase quantity if item already in basket
  } else {
    basket.items.push({ productId, quantity }); // Add new item
  }

  saveData(data);
  res.json({ message: 'Item added to basket', basket });
});


// Remove item from basket
app.delete('/api/baskets/:customerId/items/:productId', (req, res) => {
  const data = getData();
  
  const basket = data.baskets.find(b => b.customerId === req.params.customerId);
  
  if (!basket) {
    return res.status(404).json({ message: 'Basket not found' });
  }

  basket.items = basket.items.filter(item => item.productId !== parseInt(req.params.productId));
  saveData(data);
  res.json({ message: 'Item removed from basket', basket });
});


// Clear entire basket for customer
app.delete('/api/baskets/:customerId', (req, res) => {
  const data = getData();

  const basket = data.baskets.find(b => b.customerId === req.params.customerId);

  if (!basket) {
    return res.status(404).json({ message: 'Basket not found' });
  }
  basket.items = [];
  saveData(data);
  res.json({ message: 'Basket cleared', basket });
});