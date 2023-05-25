const express = require("express");
const { createProduct, createProductReview,deleteReview,getProductReviews,getAllProducts, updateProduct, getProductDetails, deleteProduct } = require('../controllers/productController')
const router = express.Router();
const Product = require('../models/productModel')
const { isAuthenticatedUser } = require('../middleware/auth')

// Get All Products
// router.route("/products").get(isAuthenticatedUser, getAllProducts);
router.route("/products").get( getAllProducts);

// Create Products
router.route('/product/new').post(createProduct)

// Update Product
router.route("/product/:id").put(updateProduct)

// Delete Product
router.route('/product/:id').delete(deleteProduct)

// Get Product Details
router.route("/product/:id").get(getProductDetails);

// Create Product Review
// router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/review").put(isAuthenticatedUser, createProductReview);
// Get Product Review
router.route('/reviews').get(getProductReviews);

// Delete Product Review
router.route('/reviews').delete(isAuthenticatedUser, deleteReview);
module.exports = router;