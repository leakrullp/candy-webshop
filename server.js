import express from "express";
import productsRouter from "./routes/products.js";
import basketRouter from "./routes/baskets.js";

const app = express();
const PORT = 3000;

app.use(express.json()); // Parse JSON request bodies

app.use("/baskets", basketRouter);
app.use("/products", productsRouter);

app.listen(PORT, () => {
  console.log(`
  Server is running on http://localhost:${PORT}

  PRODUCTS
  GET  all products:               http://localhost:${PORT}/products 
  GET  product by ID:              http://localhost:${PORT}/products/:id                              ex: http://localhost:${PORT}/products/1

  CATEGORIES
  GET  all categories:             http://localhost:${PORT}/products/categories
  GET  products by category:       http://localhost:${PORT}/products/categories/:category             ex: http://localhost:${PORT}/products/categories/Gummies

  BASKETS
  POST create basket for user:     http://localhost:${PORT}/baskets/:customerId                       ex: http://localhost:${PORT}/baskets/2
  GET  basket for user:            http://localhost:${PORT}/baskets/:customerId
  POST add item to basket:         http://localhost:${PORT}/baskets/:customerId/:productId/:quantity  ex: http://localhost:${PORT}/baskets/2/1/1
  DEL  remove item from basket:    http://localhost:${PORT}/baskets/:customerId/:productId            ex: http://localhost:${PORT}/baskets/2/1
  `);
});
