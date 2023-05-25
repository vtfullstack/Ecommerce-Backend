const Order = require('../models/orderModel');
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const ApiFeatures = require('../utils/apifeatures');


// Create New Order

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    console.log("---orderItems", req.body)
    // console.log("req",req.user)
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
    });

})

/*============================================================
            Controller for Get  user order
=============================================================*/
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (!order) {
        return next(new ErrorHander("Order not found with this Id", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
})

/*============================================================
            Controller for Get Logged In user order
=============================================================*/
exports.getloggedInUserOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.find({ user: req.user._id })


    res.status(200).json({
        success: true,
        order,
    });
})

/*============================================================
            Controller for Get All Orders
=============================================================*/
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    console.log("jvfcvgbhjn")
    const orders = await Order.find()
    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
})
/*============================================================
            Controller for  Update Orders
=============================================================*/
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHander("Order not found with this Id", 404));
    }
    if (order.orderStatus === "Delivered") {
        return next(new ErrorHander("You have already delivered this order", 400));
    }
    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity);
        });
    }
    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    });

})

/*============================================================
            Controller for  updateStock
=============================================================*/
async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.Stock -= quantity;

    await product.save({ validateBeforeSave: false });
}
async function updateStock(id, quantity) {
    const product = await Product.findById(id);
  
    product.Stock -= quantity;
  
    await product.save({ validateBeforeSave: false });
  }
  /*============================================================
            Controller for  delete Order -- Admin
=============================================================*/
  exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
  
    if (!order) {
      return next(new ErrorHander("Order not found with this Id", 404));
    }
  
    await order.remove();
  
    res.status(200).json({
      success: true,
    });
  });