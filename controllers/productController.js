const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const ApiFeatures = require("../utils/apifeatures");

/* 
----------------------------------------------------------------------------
                                Create Product
----------------------------------------------------------------------------
*/

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  console.log("Helloooooooooo", req.body);
  // let images = [];

  // if (typeof req.body.images === "string") {
  //   images.push(req.body.images);
  // } else {
  //   images = req.body.images;
  // }

  // const imagesLinks = [];

  // for (let i = 0; i < images.length; i++) {
  //   const result = await cloudinary.v2.uploader.upload(images[i], {
  //     folder: "products",
  //   });c

  //   imagesLinks.push({
  //     public_id: result.public_id,
  //     url: result.secure_url,
  //   });
  // }

  // req.body.images = imagesLinks;
  // req.body.user = req.user.id;

  const product = await Product.create(req.body);
  console.log("dfghj", product);
  res.status(201).json({
    success: true,
    product,
  });
});

/* 
----------------------------------------------------------------------------
                                Get All Products
----------------------------------------------------------------------------
*/

exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 12;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
  // const apiFeatures = new ApiFeatures(Product.find().exec(), req.query)
  // .search()
  // .filter();

  let products = await apiFeature.query;

  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);
  products = await apiFeature.query.clone();
  // products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});
/* 
----------------------------------------------------------------------------
                                Update Product
----------------------------------------------------------------------------
*/
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});
/* 
----------------------------------------------------------------------------
                                Delete Product
----------------------------------------------------------------------------
*/
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

/*
``````````````````````````````````````````````````````````````````````````````
                                Get Product Details
``````````````````````````````````````````````````````````````````````````````
*/

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  console.log(
    "getProductDetailsgetProductDetails-------------------------------------",
    product
  );
  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

/*
``````````````````````````````````````````````````````````````````````````````
                                Create Product Reiews
``````````````````````````````````````````````````````````````````````````````
*/
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  console.log("-0uygfcgvhbjnk", req.body);
  try {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
         console.log("====================",product)
    }
    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  } catch (e) {
    console.log("Error in review", e);
  }
});

/*
``````````````````````````````````````````````````````````````````````````````
                                Get Product Reiews
``````````````````````````````````````````````````````````````````````````````
*/

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  // console.log("Reqqqqqqqqqqq",req.query.productId)

  const product = await Product.findById(req.query.productId);
  console.log("product.reviewsproduct.reviews", product.reviews);
  if (!product) {
    return new ErrorHander("Product Review Not Found", 404);
  } else {
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  }
});

/*
``````````````````````````````````````````````````````````````````````````````
                                Delete Product Reiews
``````````````````````````````````````````````````````````````````````````````
*/

exports.deleteReview = catchAsyncErrors(async (req, res) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }
  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
