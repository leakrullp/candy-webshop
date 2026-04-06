import express from "express";
const router = express.Router();
import { getData, saveData } from "../serverUtil.js";

const data = getData(); //get data once

// Create or get existing basket for a customer
router.post("/:customerId", (req, res) => {
  const existing = data.baskets.find(
    (b) => b.customerId === req.params.customerId,
  );

  if (existing) {
    return res
      .status(200)
      .json({ message: "Basket already exists", basket: existing });
  }

  const newBasket = {
    customerId: req.params.customerId,
    items: [],
  };

  data.baskets.push(newBasket);
  saveData(data);

  res.status(201).json({ message: "Basket created", basket: newBasket });
});

// GET basket for a specific customer
router.get("/:customerId", (req, res) => {
  const basket = data.baskets.find(
    (b) => b.customerId === req.params.customerId,
  );

  if (!basket) {
    return res.status(404).json({ message: "No basket for this customer" });
  }

  res.status(200).json({ basket });
});

// Add item to basket
router.post("/:customerId/items", (req, res) => {
  const { productId, quantity } = req.body;

  const basket = data.baskets.find(
    (b) => b.customerId === req.params.customerId,
  );

  if (!basket) {
    return res.status(404).json({ message: "Basket not found" });
  }

  const item = basket.items.find((i) => i.productId === productId);

  if (item) {
    item.quantity += quantity; // Increase quantity if item already in basket
  } else {
    basket.items.push({ productId, quantity }); // Add new item
  }

  saveData(data);
  res.status(200).json({ message: "Item added to basket", basket });
});

// Remove item from basket
router.delete("/:customerId/items/:productId", (req, res) => {
  const basket = data.baskets.find(
    (b) => b.customerId === req.params.customerId,
  );

  if (!basket) {
    return res.status(404).json({ message: "Basket not found" });
  }

  basket.items = basket.items.filter(
    (item) => item.productId !== parseInt(req.params.productId),
  );
  saveData(data);
  res.status(200).json({ message: "Item removed from basket", basket });
});

export default router;
