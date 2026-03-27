const express = require('express');
const app = express();
app.use(express.json());

const fs = require('fs');

//helper function to read data from the JSON file
const getData = () => {
    const jsonData = fs.readFileSync('./Products/products.json', 'utf8');
    return JSON.parse(jsonData);
};

// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// get all details about a specific product
app.get('/products/:id', (req, res) => {
  const data = getData();
  const product = data.products.find(p => p.id === parseInt(req.params.id));
   if (product) {
    res.json(product); 
  } else {
    res.status(404).json({ message: "Candy not found" });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});