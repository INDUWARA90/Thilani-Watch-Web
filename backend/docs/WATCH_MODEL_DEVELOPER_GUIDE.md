# Watch Model Developer Guide

This document explains the `Watch` model in `src/models/Watch.js` and how it connects to MongoDB, controllers, and API requests.

## What This File Does

`src/models/Watch.js` defines the database structure for watch products.

It uses Mongoose:

```js
const mongoose = require('mongoose')
```

Mongoose lets the backend describe what a MongoDB document should look like, validate data before saving, and provide methods like:

```js
Watch.find()
Watch.findById()
Watch.create()
Watch.findByIdAndUpdate()
Watch.findByIdAndDelete()
```

## Schema, Model, Collection, Document

These four words are important.

### Schema

The schema is the rulebook for a watch.

```js
const watchSchema = new mongoose.Schema(...)
```

It defines fields like `name`, `price`, `sku`, `images`, and `stockQuantity`.

### Model

The model is the JavaScript object used by controllers to talk to MongoDB.

```js
module.exports = mongoose.model('Watch', watchSchema)
```

This creates a model named `Watch`.

### Collection

Mongoose automatically converts the model name into a MongoDB collection name.

```txt
Watch -> watches
```

So MongoDB stores these products in the `watches` collection.

### Document

One watch product is one MongoDB document inside the `watches` collection.

Example:

```json
{
  "_id": "665f...",
  "name": "Casio Classic Silver",
  "slug": "casio-classic-silver",
  "brand": "Casio",
  "price": 12500,
  "category": "men",
  "sku": "CASIO-CLASSIC-SILVER-001",
  "stockQuantity": 8,
  "inStock": true
}
```

## Field Reference

### `name`

Product name.

```js
name: {
  type: String,
  required: true,
  trim: true,
}
```

Rules:

- Must be provided.
- Extra spaces are removed.

Example:

```json
"name": "Casio Classic Silver"
```

### `slug`

URL-friendly unique product identifier.

```js
slug: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
}
```

Example:

```json
"slug": "casio-classic-silver"
```

Used later for frontend product pages like:

```txt
/products/casio-classic-silver
```

Rules:

- Must be provided.
- Must be unique.
- Automatically stored lowercase.

### `brand`

Watch brand.

```js
brand: {
  type: String,
  required: true,
  trim: true,
}
```

Example:

```json
"brand": "Casio"
```

### `description`

Full product description for the product detail page.

```js
description: {
  type: String,
  default: '',
  trim: true,
}
```

### `shortDescription`

Short text for listing cards.

```js
shortDescription: {
  type: String,
  default: '',
  trim: true,
}
```

Example:

```json
"shortDescription": "Classic analog watch with stainless steel design."
```

### `price`

Selling price.

```js
price: {
  type: Number,
  required: true,
  min: 0,
}
```

Rules:

- Must be provided.
- Cannot be negative.

### `currency`

Currency code.

```js
currency: {
  type: String,
  default: 'LKR',
  uppercase: true,
  trim: true,
}
```

If the request sends:

```json
"currency": "lkr"
```

MongoDB stores:

```json
"currency": "LKR"
```

### `images`

Multiple product image URLs.

```js
images: {
  type: [String],
  default: [],
  set: (images) => (Array.isArray(images) ? images.filter(Boolean) : []),
}
```

Example:

```json
"images": [
  "https://example.com/watch-front.jpg",
  "https://example.com/watch-side.jpg"
]
```

The setter removes empty values.

This:

```json
"images": ["front.jpg", "", null, "side.jpg"]
```

Becomes:

```json
"images": ["front.jpg", "side.jpg"]
```

### `thumbnail`

Main image shown in product cards.

```js
thumbnail: {
  type: String,
  default: '',
  trim: true,
}
```

If `thumbnail` is not sent, the pre-validation hook uses the first image from `images`.

### `category`

Product category.

```js
category: {
  type: String,
  required: true,
  trim: true,
  lowercase: true,
}
```

Examples:

```txt
men
women
kids
luxury
smart
classic
```

### `collection`

Product collection/group.

```js
collection: {
  type: String,
  default: '',
  trim: true,
  lowercase: true,
}
```

Examples:

```txt
new-arrivals
best-sellers
premium
```

Note: `collection` is a reserved Mongoose schema path name, so the schema uses:

```js
suppressReservedKeysWarning: true
```

This keeps the API field named `collection`.

### Product Detail Fields

These fields describe the watch:

```js
movementType
caseMaterial
strapMaterial
waterResistance
color
dialColor
size
```

Examples:

```json
{
  "movementType": "quartz",
  "caseMaterial": "stainless steel",
  "strapMaterial": "metal",
  "waterResistance": "50m",
  "color": "silver",
  "dialColor": "white",
  "size": "40mm"
}
```

### `sku`

Unique stock keeping unit.

```js
sku: {
  type: String,
  required: true,
  unique: true,
  uppercase: true,
  trim: true,
}
```

Rules:

- Must be provided.
- Must be unique.
- Automatically stored uppercase.

Example:

```json
"sku": "CASIO-CLASSIC-SILVER-001"
```

### `stockQuantity`

Number of available items.

```js
stockQuantity: {
  type: Number,
  default: 0,
  min: 0,
}
```

Rules:

- Defaults to `0`.
- Cannot be negative.

### `inStock`

Boolean stock status.

```js
inStock: {
  type: Boolean,
  default: true,
}
```

This is automatically controlled by `stockQuantity`.

```txt
stockQuantity > 0 -> inStock = true
stockQuantity = 0 -> inStock = false
```

Do not trust frontend `inStock` values. The model sets it on create/save and update.

### `isFeatured`

Controls homepage or featured product sections.

```js
isFeatured: {
  type: Boolean,
  default: false,
}
```

### `isPublished`

Controls customer visibility.

```js
isPublished: {
  type: Boolean,
  default: true,
}
```

Later, public customer APIs should return only:

```js
{ isPublished: true }
```

### Rating Fields

```js
ratingAverage: {
  type: Number,
  default: 0,
  min: 0,
  max: 5,
}
```

```js
ratingCount: {
  type: Number,
  default: 0,
  min: 0,
}
```

These are for future review/rating features.

## Schema Options

```js
{
  timestamps: true,
  suppressReservedKeysWarning: true,
}
```

### `timestamps: true`

Automatically adds:

```js
createdAt
updatedAt
```

### `suppressReservedKeysWarning: true`

Allows the model to use the field name `collection` without Mongoose printing a warning.

## Middleware Hooks

The file has two Mongoose pre hooks.

### `pre('validate')`

```js
watchSchema.pre('validate', function setDerivedWatchFields() {
  if (!this.thumbnail) {
    this.thumbnail = this.images[0] || ''
  }
  this.inStock = this.stockQuantity > 0
})
```

This runs before Mongoose validates a document.

It runs during:

```js
Watch.create(req.body)
```

and:

```js
const watch = new Watch(data)
await watch.save()
```

It does two things:

1. If no `thumbnail` is provided, use the first image from `images`.
2. Set `inStock` based on `stockQuantity`.

Example input:

```json
{
  "images": ["front.jpg", "side.jpg"],
  "stockQuantity": 5
}
```

Before saving, the model derives:

```json
{
  "thumbnail": "front.jpg",
  "inStock": true
}
```

### `pre('findOneAndUpdate')`

```js
watchSchema.pre('findOneAndUpdate', function setUpdatedWatchFields() {
  const update = this.getUpdate()
  const fields = update.$set || update

  if (fields.stockQuantity !== undefined) {
    fields.inStock = fields.stockQuantity > 0
  }

  if (!fields.thumbnail && Array.isArray(fields.images) && fields.images.length > 0) {
    fields.thumbnail = fields.images[0]
  }

  if (!update.$set) {
    this.setUpdate(fields)
  }
})
```

This runs before update queries like:

```js
Watch.findByIdAndUpdate(id, req.body)
```

`findByIdAndUpdate` internally uses `findOneAndUpdate`, so this hook runs.

It keeps update behavior consistent with create behavior:

- If `stockQuantity` changes, update `inStock`.
- If `images` changes and no `thumbnail` is provided, use the first image.

## Why There Is No `next()`

Older Mongoose middleware often used:

```js
function middleware(next) {
  next()
}
```

In this project's Mongoose version, the hook can be synchronous.

So this is correct:

```js
watchSchema.pre('validate', function setDerivedWatchFields() {
  this.inStock = this.stockQuantity > 0
})
```

Mongoose continues automatically when the function finishes.

Using `next()` caused this error:

```txt
TypeError: next is not a function
```

## Controller Usage

The controller imports the model:

```js
const Watch = require('../models/Watch')
```

### Get All Watches

```js
const watches = await Watch.find().sort({ createdAt: -1 })
```

Reads all documents from the `watches` collection and sorts newest first.

### Get One Watch

```js
const watch = await Watch.findById(req.params.id)
```

Finds one watch by MongoDB `_id`.

### Create Watch

```js
const watch = await Watch.create(req.body)
```

Creates one document in the `watches` collection.

### Update Watch

```js
const watch = await Watch.findByIdAndUpdate(req.params.id, req.body, {
  returnDocument: 'after',
  runValidators: true,
})
```

Updates one watch.

`returnDocument: 'after'` means return the updated document.

`runValidators: true` means Mongoose validates update data.

### Delete Watch

```js
const watch = await Watch.findByIdAndDelete(req.params.id)
```

Deletes one document from the `watches` collection.

## Example Create Request

Use this body for `POST /api/watches`:

```json
{
  "name": "Casio Classic Silver",
  "slug": "casio-classic-silver",
  "brand": "Casio",
  "description": "A reliable classic analog watch with a stainless steel case, clean dial, and comfortable metal strap for everyday wear.",
  "shortDescription": "Classic analog watch with stainless steel design.",
  "price": 12500,
  "currency": "LKR",
  "images": [
    "https://example.com/images/casio-classic-front.jpg",
    "https://example.com/images/casio-classic-side.jpg"
  ],
  "category": "men",
  "collection": "new-arrivals",
  "movementType": "quartz",
  "caseMaterial": "stainless steel",
  "strapMaterial": "metal",
  "waterResistance": "50m",
  "color": "silver",
  "dialColor": "white",
  "size": "40mm",
  "sku": "CASIO-CLASSIC-SILVER-001",
  "stockQuantity": 8,
  "isFeatured": true,
  "isPublished": true
}
```

The model automatically adds:

```json
{
  "thumbnail": "https://example.com/images/casio-classic-front.jpg",
  "inStock": true,
  "createdAt": "...",
  "updatedAt": "..."
}
```

## Example Update Request

Use this body for `PUT /api/watches/:id`:

```json
{
  "stockQuantity": 0
}
```

The update hook automatically sets:

```json
{
  "inStock": false
}
```

## Common Errors

### Missing Required Fields

If you do not send required fields like `name`, `slug`, `brand`, `price`, `category`, or `sku`, Mongoose throws a validation error.

Required fields:

```txt
name
slug
brand
price
category
sku
```

### Duplicate `slug`

If another watch already has the same slug, MongoDB throws a duplicate key error.

Example:

```txt
E11000 duplicate key error collection: watches index: slug_1
```

### Duplicate `sku`

Same idea. SKU must be unique.

```txt
E11000 duplicate key error collection: watches index: sku_1
```

### Negative Price

Invalid:

```json
{
  "price": -100
}
```

### Negative Stock

Invalid:

```json
{
  "stockQuantity": -1
}
```

## Developer Notes

- The frontend should send `images` as an array.
- The frontend does not need to send `thumbnail` if the first image should be the main image.
- The frontend should not control `inStock`; backend derives it from `stockQuantity`.
- `slug` should be generated from the product name or entered by admin.
- `sku` should be unique for inventory tracking.
- Later customer-facing routes should filter by `isPublished: true`.
- Later admin routes can show both published and unpublished watches.
- Later checkout/order logic must check `stockQuantity` before creating an order.

## Mental Model

Think of it like this:

```txt
Watch.js
  defines the shape and rules

Watch model
  lets controller code talk to MongoDB

watches collection
  stores all watch products

one watch document
  stores one product
```

