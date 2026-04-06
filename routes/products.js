import express from "express";
const router = express.Router();
import { getData, getCurrentPrice } from "../serverUtil.js";

const data = getData(); //get data once

// GET all products
router.get("/", (req, res) => {
  const productsWithPrice = data.products.map((p) => ({
    ...p,
    price: getCurrentPrice(p),
  }));

  res.status(200).json({ products: productsWithPrice });
});

// GET product by ID
router.get("/:id", (req, res) => {
  const product = data.products.find((p) => p.id === parseInt(req.params.id));

  if (product) {
    res.status(200).json({ ...product, price: getCurrentPrice(product) });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// GET product categories
router.get("/categories", (req, res) => {
  const categories = [...new Set(data.products.map((p) => p.category))];
  res.status(200).json({ categories });
});

// GET products by category
router.get("/categories/:category", (req, res) => {
  const products = data.products
    .filter(
      (p) => p.category.toLowerCase() === req.params.category.toLowerCase(),
    )
    .map((p) => ({ ...p, price: getCurrentPrice(p) }));
  if (products.length === 0) {
    return res
      .status(404)
      .json({ message: "No products found in this category" });
  }

  res.status(200).json({ products });
});

export default router;
