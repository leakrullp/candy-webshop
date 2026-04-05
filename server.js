import express from "express";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(express.json());

// GET product categories
app.get("/api/categories", (req, res) => {
  const categories = [...new Set(candyProducts.map((p) => p.category))];
  res.json({ categories });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}\n
  See all products on http://localhost:${PORT}/api/categories\n
  See all products with current price on http://localhost:${PORT}/api/products\n
  See basket for a specific customer on http://localhost:${PORT}/api/baskets/1`);
}); 

//GET products with the current price after applying discount
function getCurrentPrice(product) {
  const { originalPrice, discount } = product;
  if (discount > 0) {
    return originalPrice - originalPrice * (discount / 100);
  }
  return originalPrice;
}

// GET all products with current price
app.get("/api/products", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

  const productsWithPrice = data.products.map((p) => ({
    ...p,
    price: getCurrentPrice(p),
  }));

  res.json({ products: productsWithPrice });
});

// GET basket for a specific customer
app.get("/api/baskets/:customerId", (req, res) => {
    const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
  
    const basket = data.baskets.find((b) => b.customerId === req.params.customerId);
  
    if (!basket) {
      return res.status(404).json({ message: "Ingen kurv fundet for denne bruger" });
    }
  
    res.json({ basket });
  });
