# How to use RESTful API
1. Clone the repo's branch `main`
2. Run the command `npm start` to start the server
3. You will see the following API path options in the log:
```
Server is running on http://localhost:3000

  PRODUCTS
  GET  all products:               http://localhost:3000/products 
  GET  product by ID:              http://localhost:3000/products/:id                              ex: http://localhost:3000/products/1

  CATEGORIES
  GET  all categories:             http://localhost:3000/products/categories
  GET  products by category:       http://localhost:3000/products/categories/:category             ex: http://localhost:3000/products/categories/Gummies

  BASKETS
  POST create basket for user:     http://localhost:3000/baskets/:customerId                       ex: http://localhost:3000/baskets/2
  GET  basket for user:            http://localhost:3000/baskets/:customerId
  POST add item to basket:         http://localhost:3000/baskets/:customerId/:productId/:quantity  ex: http://localhost:3000/baskets/2/1/1
  DEL  remove item from basket:    http://localhost:3000/baskets/:customerId/:productId            ex: http://localhost:3000/baskets/2/1
```
