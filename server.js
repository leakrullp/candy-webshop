const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
const publicPath = path.join(__dirname); // Path to static files
app.use(express.static(publicPath)); // Serve static files from project root

// File paths for data persistence
const basketsFilePath = path.join(__dirname, 'baskets.json');
const customersFilePath = path.join(__dirname, 'customers.json');
const productsFilePath = path.join(__dirname, 'Products', 'products.json');

// Helper function to read product data from JSON file
const getData = () => {
  const jsonData = fs.readFileSync(productsFilePath, 'utf8');
  return JSON.parse(jsonData);
};

// Helper function to read baskets data from JSON file
const getBaskets = async () => {
  try {
    const raw = await fs.promises.readFile(basketsFilePath, 'utf8');
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    if (err.code === 'ENOENT') {
      return {}; // Return empty object if file doesn't exist
    }
    throw err;
  }
};

// Helper function to save baskets data to JSON file
const saveBaskets = async (baskets) => {
  await fs.promises.writeFile(basketsFilePath, JSON.stringify(baskets, null, 2));
};

// Helper function to read customers data from JSON file
const getCustomers = async () => {
  try {
    const raw = await fs.promises.readFile(customersFilePath, 'utf8');
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    if (err.code === 'ENOENT') {
      return {}; // Return empty object if file doesn't exist
    }
    throw err;
  }
};

// Helper function to save customers data to JSON file
const saveCustomers = async (customers) => {
  await fs.promises.writeFile(customersFilePath, JSON.stringify(customers, null, 2));
};

// Helper function to normalize names for consistent matching
const normalizeName = (value) => value.trim().toLowerCase();

// Helper function to create unique customer ID from first and last name
const createCustomerId = (firstName, lastName) => {
  const baseId = `${normalizeName(firstName)}-${normalizeName(lastName)}`.replace(/\s+/g, '-');
  return baseId;
};

// Health check endpoint
app.get('/status', (req, res) => {
  res.send('Server is running');
});

// Root endpoint to serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Get all products
app.get('/products', (req, res) => {
  const data = getData();
  res.json(data.products);
});

// Get a specific product by ID
app.get('/products/:id', (req, res) => {
  const data = getData();
  const product = data.products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Candy not found' });
  }
});

// Create a new customer
app.post('/customers', async (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).json({ message: 'firstName and lastName are required' });
  }

  const customers = await getCustomers();
  const baseId = createCustomerId(firstName, lastName);
  let customerId = baseId;
  let suffix = 1;
  while (customers[customerId]) {
    customerId = `${baseId}-${suffix++}`; // Ensure unique ID
  }

  customers[customerId] = {
    id: customerId,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    createdAt: new Date().toISOString(),
  };

  await saveCustomers(customers);
  res.status(201).json({ message: 'Customer created', customer: customers[customerId] });
});

// Login endpoint to authenticate existing customer
app.post('/customers/login', async (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).json({ message: 'firstName and lastName are required' });
  }

  const customers = await getCustomers();
  const customer = Object.values(customers).find(
    (c) => normalizeName(c.firstName) === normalizeName(firstName) && normalizeName(c.lastName) === normalizeName(lastName),
  );

  if (!customer) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  res.json({ customer });
});

// Get customer details by ID
app.get('/customers/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const customers = await getCustomers();
  const customer = customers[customerId];
  if (!customer) {
    return res.status(404).json({ message: 'Customer not found' });
  }
  res.json({ customer });
});

// Create or get existing basket for a customer
app.post('/baskets/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const baskets = await getBaskets();

  if (!baskets[customerId]) {
    baskets[customerId] = { items: [] };
    await saveBaskets(baskets);
    return res.status(201).json({ message: 'Basket created', basket: baskets[customerId] });
  }

  res.json({ message: 'Basket already exists', basket: baskets[customerId] });
});

// Get customer's basket
app.get('/baskets/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const baskets = await getBaskets();
  const basket = baskets[customerId];
  if (!basket) {
    return res.status(404).json({ message: 'Basket not found' });
  }
  res.json(basket);
});

// Add item to customer's basket - added here but didn't add anywhere else in the code 
app.post('/baskets/:customerId/items', async (req, res) => {
  const { customerId } = req.params;
  const { productId, quantity } = req.body;

  if (!productId || typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ message: 'productId and positive quantity are required' });
  }

  const baskets = await getBaskets();
  if (!baskets[customerId]) {
    baskets[customerId] = { items: [] };
  }

  const basket = baskets[customerId];
  const existingItem = basket.items.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity; // Increase quantity if item exists
  } else {
    basket.items.push({ productId, quantity }); // Add new item
  }

  await saveBaskets(baskets);
  res.json(basket);
});

// Remove item from customer's basket
app.delete('/baskets/:customerId/items/:productId', async (req, res) => {
  const { customerId, productId } = req.params;
  const baskets = await getBaskets();
  const basket = baskets[customerId];

  if (!basket) {
    return res.status(404).json({ message: 'Basket not found' });
  }

  basket.items = basket.items.filter(item => item.productId !== parseInt(productId));
  await saveBaskets(baskets);
  res.json(basket);
});

// Clear entire basket for customer
app.delete('/baskets/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const baskets = await getBaskets();

  if (!baskets[customerId]) {
    return res.status(404).json({ message: 'Basket not found' });
  }

  baskets[customerId].items = [];
  await saveBaskets(baskets);
  res.json({ message: 'Basket cleared', basket: baskets[customerId] });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});