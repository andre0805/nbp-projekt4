const fs = require('fs');

// 1. Parse the data from the file
const reviewsJson = fs.readFileSync('reviews.json', 'utf-8');
const reviews = JSON.parse(reviewsJson);

const reviewsWithProductPriceLTE15 = reviews.filter(r => r.product.price && r.product.price <= 15);
fs.writeFileSync('reviews_lte15.json', JSON.stringify(reviewsWithProductPriceLTE15, null, 2));

const reviewsWithProductPriceGT15 = reviews.filter(r => r.product.price && r.product.price > 15);
fs.writeFileSync('reviews_gt15.json', JSON.stringify(reviewsWithProductPriceGT15, null, 2));