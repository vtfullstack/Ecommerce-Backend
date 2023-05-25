const express = require("express");
const { newOrder ,getSingleOrder,getloggedInUserOrder,getAllOrders,updateOrder,updateStock,deleteOrder} = require('../controllers/orderController')
const router = express.Router();
const Order = require('../models/orderModel')
const { isAuthenticatedUser,authorizeRoles } = require('../middleware/auth')

// Create Order
router.route('/order/new').post(isAuthenticatedUser,newOrder);

// Get Users Order By Admin
router.route("/admin/orders/:id").get(isAuthenticatedUser, authorizeRoles("admin"),getSingleOrder);
// Get LoggedIn users Order
router.route("/orders/me").get(isAuthenticatedUser,getloggedInUserOrder)

router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin") ,getAllOrders);

router.route("/admin/order/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)

router.route("/admin/order/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports=router;