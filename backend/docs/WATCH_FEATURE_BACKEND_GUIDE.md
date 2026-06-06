# Watch Feature Backend Guide

This guide explains how the Watch backend feature works in this project. It is written as a practical walkthrough: what each file does, how a request travels through the backend, how the Watch model stores data, and how public and admin routes behave.

Use this file when you want to understand or change:

- Product listing pages
- Product detail pages
- Featured watches
- New arrivals
- Best sellers
- Admin product create/update/delete actions
- Stock and publish status logic
- Watch model fields

## Big Picture

The Watch feature is the product system for the ecommerce site.

A frontend request does not talk to MongoDB directly. It goes through Express routes, controller logic, and the Mongoose model.

```txt
Frontend
  sends HTTP request

Express app
  receives the request and sends it to /api routes

Watch routes
  decide which controller function should run

Watch controller
  reads params/query/body, builds database query, returns JSON

Watch model
  validates product data and talks to MongoDB

MongoDB
  stores watch documents in the watches collection
```

Example:

```txt
GET /api/watches?category=men&sort=price_asc
```

The backend handles it like this:

```txt
src/app.js
  -> src/routes/index.js
  -> src/routes/watchRoutes.js
  -> getWatches() in src/controllers/watchController.js
  -> Watch.find(...) in src/models/Watch.js
  -> MongoDB watches collection
  -> JSON response to frontend
```

## File By File Explanation

### `server.js`

`server.js` is the starting point of the backend.

It does not define product routes. Its job is to prepare the backend and start the server.

What happens:

1. Loads environment variables from `.env`.
2. Checks important environment variables with `validateEnv()`.
3. Imports the Express app from `src/app.js`.
4. Connects to MongoDB.
5. Starts the server only after MongoDB connects.

Why this matters:

If MongoDB is not connected, product routes cannot read or write watches. That is why the app starts listening only after `connectDB()` succeeds.

Flow:

```txt
dotenv.config()
  -> validateEnv()
  -> connectDB()
  -> app.listen()
```

Keep this file small. Route code belongs in route files. Database schema code belongs in model files.

### `src/config/env.js`

This file checks required `.env` values.

Important values:

```txt
MONGO_URI
CLIENT_URL
JWT_SECRET
```

What each one is for:

`MONGO_URI`: MongoDB connection string.

`CLIENT_URL`: Frontend URL allowed by CORS.

`JWT_SECRET`: Secret used to verify JWT auth tokens.

Auth also uses an `httpOnly` cookie named `token` for browser sessions.

Current behavior:

```txt
Missing env variable -> log warning
```

It does not currently stop the server. For production, it is safer to throw an error when required values are missing.

### `src/config/db.js`

This file owns the MongoDB connection.

What happens:

1. Reads `process.env.MONGO_URI`.
2. Uses Mongoose to connect to MongoDB.
3. Returns success or throws an error back to `server.js`.

Why this file exists:

All MongoDB connection setup stays in one place. If the database connection changes later, you update this file instead of searching through the whole backend.

### `src/app.js`

`src/app.js` builds the Express application.

What happens in order:

1. Creates the Express app.
2. Allows frontend requests using CORS.
3. Enables credentials so browsers can send auth cookies.
4. Parses cookies with `cookie-parser`.
5. Parses JSON request bodies.
6. Parses form request bodies.
7. Adds the health check endpoint.
8. Mounts all API routes at `/api`.
9. Adds 404 and error handlers at the end.

Important order:

```txt
CORS and body parsers
  must run before routes

cookie parser
  must run before protected routes

routes
  must run before notFound

notFound and errorHandler
  must run last
```

Health check:

```txt
GET /api/health
```

Use this to confirm the backend is running.

### `src/routes/index.js`

This is the main router for all API features.

Current route setup:

```js
router.use('/auth', authRoutes)
router.use('/watches', watchRoutes)
```

Because `src/app.js` mounts this router at `/api`, the final URLs become:

```txt
/api/auth
/api/watches
```

Why this file exists:

It keeps `app.js` clean. When more features are added, such as orders, coupons, or admin dashboard routes, their routers should be mounted here.

### `src/routes/authRoutes.js`

This file defines authentication URLs.

Auth routes:

```txt
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
PUT /api/auth/profile
PUT /api/auth/change-password
```

Public auth routes:

```txt
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

Protected auth routes:

```txt
GET /api/auth/me
PUT /api/auth/profile
PUT /api/auth/change-password
```

Protected routes use `protect`, which means the request must include:

```txt
Authorization: Bearer <token>
```

Browser requests can also authenticate with the `httpOnly` `token` cookie set during login/register.

### `src/routes/watchRoutes.js`

This file defines the Watch API URLs.

It answers this question:

```txt
When this URL is called, which controller function should run?
```

Public routes:

```txt
GET /api/watches
GET /api/watches/featured
GET /api/watches/new-arrivals
GET /api/watches/best-sellers
GET /api/watches/slug/:slug
GET /api/watches/:id
```

Admin routes:

```txt
POST /api/watches
PUT /api/watches/:id
PATCH /api/watches/:id/stock
PATCH /api/watches/:id/publish
DELETE /api/watches/:id
```

Public routes do not need a token. Admin routes use:

```js
protect, adminOnly
```

Example route:

```js
router.route('/').get(getWatches).post(protect, adminOnly, createWatch)
```

This means:

```txt
GET /api/watches
  public product list

POST /api/watches
  logged-in admin-only product creation
```

Important route order:

```txt
/featured
/new-arrivals
/best-sellers
/slug/:slug
/:id
```

The fixed routes must come before `/:id`. If `/:id` comes first, Express may treat `featured` as an ID.

### `src/controllers/watchController.js`

This file contains the behavior behind each Watch route.

Routes say what URL exists. Controllers say what happens when that URL is called.

The controller does these things:

1. Reads request data.
2. Validates simple route-specific input.
3. Builds MongoDB filters.
4. Calls the Watch model.
5. Sends JSON responses.

Request data can come from three places:

```txt
req.params
  route values like :id or :slug

req.query
  URL query values like ?page=1&sort=newest

req.body
  JSON body for POST, PUT, and PATCH
```

Main controller functions:

`getWatches`: Public list with pagination, sorting, search, and filters.

`getWatch`: Public single watch by MongoDB ID.

`getWatchBySlug`: Public single watch by slug.

`getFeaturedWatches`: Public featured products.

`getNewArrivals`: Public newest products.

`getBestSellers`: Public best-seller list by `salesCount`.

`createWatch`: Admin creates a product.

`updateWatch`: Admin updates product fields.

`updateWatchStock`: Admin updates only stock quantity.

`updateWatchPublish`: Admin publishes or unpublishes a product.

`deleteWatch`: Admin soft deletes a product.

Public visibility rule:

```js
{
  isPublished: true,
  deletedAt: null
}
```

Every public read must use this rule. It prevents customers from seeing unpublished or deleted products.

### `src/controllers/authController.js`

This file contains authentication behavior.

Main controller functions:

`register`: Creates a customer account, hashes the password through the User model, and returns a JWT.

`login`: Checks email and password, rejects inactive accounts, returns a JWT, and sets the auth cookie.

On successful register/login, the controller sets:

```txt
Set-Cookie: token=<jwt>; HttpOnly
```

`logout`: Clears the `token` cookie and returns a success message. The frontend should also remove any token it stored manually.

`getMe`: Returns the logged-in user from `req.user`.

`updateProfile`: Updates safe profile fields like `name`, `phone`, and `addresses`.

`changePassword`: Checks the current password, then saves a new hashed password.

Security rule:

```txt
Password hashes are never returned in API responses.
```

### Controller Helper Functions

`positiveInteger(value, fallback)`

Used for pagination. If a user sends bad values like `page=abc`, the backend falls back to a safe number.

```txt
?page=2 -> 2
?page=abc -> fallback
```

`booleanValue(value)`

Used for query/body values that can be true or false.

```txt
"true" -> true
"false" -> false
true -> true
false -> false
anything else -> undefined
```

`publishedFilter()`

Returns the required public product filter:

```js
{
  isPublished: true,
  deletedAt: null
}
```

`listLimit(value)`

Controls how many products can be returned.

```txt
default limit -> 12
maximum limit -> 100
```

This protects the API from very large product list requests.

`listSort(sort)`

Converts frontend sort names into MongoDB sort objects.

```txt
newest -> { createdAt: -1 }
price_asc -> { price: 1 }
price_desc -> { price: -1 }
```

`buildListFilter(query)`

Converts query params into a MongoDB filter.

Example:

```txt
GET /api/watches?category=men&brand=Casio&minPrice=5000&featured=true
```

Becomes a filter like:

```js
{
  isPublished: true,
  deletedAt: null,
  category: 'men',
  brand: /^Casio$/i,
  price: { $gte: 5000 },
  isFeatured: true
}
```

### `src/models/Watch.js`

This file defines how a watch is stored in MongoDB.

The model answers these questions:

```txt
What fields can a watch have?
Which fields are required?
What default values are used?
Which values must be unique?
Which values are automatically changed before saving?
```

Mongoose model export:

```js
module.exports = mongoose.model('Watch', watchSchema)
```

MongoDB collection name:

```txt
Watch model -> watches collection
```

The controller uses this model:

```js
Watch.find(...)
Watch.findOne(...)
Watch.create(...)
Watch.findByIdAndUpdate(...)
Watch.countDocuments(...)
```

### `src/models/User.js`

This file defines how users are stored in MongoDB.

User fields:

```txt
name
email
password
phone
role
isActive
addresses
createdAt
updatedAt
```

Roles:

```txt
customer
admin
```

Important password behavior:

```txt
Plain password enters backend
  -> User model hashes it with bcrypt before save
  -> MongoDB stores only the hash
  -> API responses remove password
```

The password field uses:

```js
select: false
```

That means normal user queries do not return password hashes. Login and password-change code must explicitly request `+password` when it needs to compare passwords.

### `src/middleware/authMiddleware.js`

This middleware protects logged-in and admin-only routes.

It exports:

```js
protect
adminOnly
```

`protect` runs first. It verifies the JWT and loads the real user from MongoDB.

It accepts the token from:

```txt
1. token cookie
2. Authorization: Bearer <token>
```

`adminOnly` runs after `protect`. It checks:

```js
req.user.role === 'admin'
```

Expected request header:

```txt
Authorization: Bearer <jwt>
```

What `protect` does:

1. Reads the `token` cookie.
2. Falls back to the `Authorization: Bearer <token>` header if no cookie exists.
3. Verifies the token with `JWT_SECRET`.
4. Finds the user in MongoDB.
5. Rejects missing or inactive users.
6. Adds the user document to `req.user`.
7. Allows the request to continue.

What `adminOnly` does:

```txt
req.user.role is admin -> continue
req.user.role is customer -> 403
```

If the token is missing:

```txt
401 Authentication required
```

If the token is invalid or expired:

```txt
401 Invalid or expired token
```

If the logged-in user is not admin:

```txt
403 Admin access required
```

### `src/middleware/adminMiddleware.js`

This file is only a compatibility wrapper now.

It exports `adminOnly` from `authMiddleware.js` for any old imports. New routes should import from:

```js
const { protect, adminOnly } = require('../middleware/authMiddleware')
```

### `src/middleware/errorMiddleware.js`

This file formats errors into API responses.

Two middleware functions exist here:

`notFound`

Runs when no route matched the request.

Example:

```txt
GET /api/unknown
```

Returns a 404 route error.

`errorHandler`

Runs when a controller or middleware passes an error.

It handles common Mongoose errors:

```txt
Invalid MongoDB id -> 400 Invalid resource id
Schema validation error -> 400 readable validation message
Other server error -> 500 Server error
```

### `src/utils/asyncHandler.js`

This helper prevents repeated `try/catch` blocks in controllers.

Without `asyncHandler`, every async controller would need:

```js
try {
  // database work
} catch (error) {
  next(error)
}
```

With `asyncHandler`, the controller can be written cleanly:

```js
const getWatches = asyncHandler(async (req, res) => {
  const watches = await Watch.find()
  res.json(watches)
})
```

If the database call fails, `asyncHandler` sends the error to `errorHandler`.

### `docs/BACKEND_IMPLEMENTATION_TODO.md`

This file tracks backend work that still needs to be done.

When a TODO is implemented:

1. Add or update the real code.
2. Update related documentation.
3. Remove the completed TODO comment or section.

The Watch API improvement work is now implemented in:

```txt
src/models/Watch.js
src/controllers/watchController.js
src/routes/watchRoutes.js
src/middleware/authMiddleware.js
```

## Watch Model Data

One watch document looks like this:

```json
{
  "_id": "665f...",
  "name": "Casio Classic Silver",
  "slug": "casio-classic-silver",
  "brand": "Casio",
  "description": "A reliable classic analog watch.",
  "shortDescription": "Classic analog watch.",
  "price": 12500,
  "currency": "LKR",
  "images": ["front.jpg", "side.jpg"],
  "thumbnail": "front.jpg",
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
  "inStock": true,
  "isFeatured": true,
  "isPublished": true,
  "ratingAverage": 0,
  "ratingCount": 0,
  "salesCount": 0,
  "deletedAt": null,
  "createdAt": "...",
  "updatedAt": "..."
}
```

## Required Fields

These fields are required when creating a watch:

```txt
name
slug
brand
price
category
sku
```

Minimum valid create body:

```json
{
  "name": "Casio Classic Silver",
  "slug": "casio-classic-silver",
  "brand": "Casio",
  "price": 12500,
  "category": "men",
  "sku": "CASIO-CLASSIC-SILVER-001",
  "stockQuantity": 8
}
```

## Field Explanation

`name`

The product name shown to users.

Rules:

```txt
required
trimmed
```

`slug`

The URL-friendly product name. This is used for product detail pages.

Example:

```txt
/products/casio-classic-silver
```

Rules:

```txt
required
unique
lowercase
trimmed
```

`brand`

The watch brand, such as `Casio`, `Rolex`, or `Seiko`.

Rules:

```txt
required
trimmed
```

`description`

Full product description for the detail page.

`shortDescription`

Small description for product cards and listing pages.

`price`

Selling price.

Rules:

```txt
required
minimum 0
```

`currency`

Currency code. Defaults to `LKR`.

If the frontend sends:

```json
{
  "currency": "lkr"
}
```

MongoDB stores:

```json
{
  "currency": "LKR"
}
```

`images`

Array of product image URLs.

Empty values are removed automatically.

Input:

```json
{
  "images": ["front.jpg", "", null, "side.jpg"]
}
```

Stored:

```json
{
  "images": ["front.jpg", "side.jpg"]
}
```

`thumbnail`

Main image shown in product cards. If it is not sent, the model uses the first image.

`category`

Product category. Required and stored lowercase.

Examples:

```txt
men
women
kids
luxury
smart
classic
```

`collection`

Optional product group.

Examples:

```txt
new-arrivals
best-sellers
premium
```

`movementType`, `caseMaterial`, `strapMaterial`, `waterResistance`, `color`, `dialColor`, `size`

Optional product detail fields. These are useful for the product page and future filtering.

`sku`

Unique stock keeping unit for inventory.

Rules:

```txt
required
unique
uppercase
trimmed
```

`stockQuantity`

Number of available items.

Rules:

```txt
default 0
minimum 0
```

`inStock`

Stock status. The backend derives it from `stockQuantity`.

```txt
stockQuantity > 0 -> inStock = true
stockQuantity = 0 -> inStock = false
```

The frontend should not control this value.

`isFeatured`

Used for homepage featured products.

`isPublished`

Controls whether customers can see the watch.

```txt
true -> visible in public routes
false -> hidden from public routes
```

`ratingAverage` and `ratingCount`

Reserved for future customer review features.

`salesCount`

Used for best-seller sorting.

Right now it defaults to `0`. When orders are implemented, successful orders should increase this value.

`deletedAt`

Used for soft delete.

```txt
null -> active watch
date -> deleted watch
```

Deleted watches stay in MongoDB but disappear from public routes.

## Model Hooks

The model has hooks that run automatically before data is saved or updated.

### Create Hook

Runs before validation on create/save:

```js
watchSchema.pre('validate', function setDerivedWatchFields() {
  if (!this.thumbnail) {
    this.thumbnail = this.images[0] || ''
  }
  this.inStock = this.stockQuantity > 0
})
```

Example input:

```json
{
  "images": ["front.jpg"],
  "stockQuantity": 3
}
```

Before saving, the model adds:

```json
{
  "thumbnail": "front.jpg",
  "inStock": true
}
```

### Update Hook

Runs before `findByIdAndUpdate` because Mongoose uses `findOneAndUpdate` internally.

It does two important things:

1. If `stockQuantity` changes, update `inStock`.
2. If `images` changes and no `thumbnail` is sent, use the first image.

This keeps create and update behavior consistent.

## Indexes

Indexes help MongoDB find products faster.

Current indexes:

```js
watchSchema.index({ isPublished: 1, deletedAt: 1, createdAt: -1 })
watchSchema.index({ category: 1, brand: 1, price: 1 })
```

Why they exist:

The public product list usually filters by published/active products and sorts newest first. Listing pages may also filter by category, brand, and price.

## Public API

Public routes are for customers. They only return watches where:

```js
{
  isPublished: true,
  deletedAt: null
}
```

### Product List

```txt
GET /api/watches
```

Supported query params:

```txt
page
limit
sort
search
category
brand
minPrice
maxPrice
stock
featured
```

Example:

```txt
GET /api/watches?page=1&limit=12&category=men&sort=price_asc
```

Response:

```json
{
  "watches": [],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 0,
    "pages": 0
  }
}
```

Pagination:

```txt
default page -> 1
default limit -> 12
maximum limit -> 100
```

Sort values:

```txt
newest
price_asc
price_desc
```

Filter examples:

```txt
GET /api/watches?search=casio
GET /api/watches?brand=Rolex
GET /api/watches?category=men
GET /api/watches?minPrice=5000&maxPrice=25000
GET /api/watches?featured=true
GET /api/watches?stock=true
```

### Product By ID

```txt
GET /api/watches/:id
```

Use this when you already have the MongoDB ID.

### Product By Slug

```txt
GET /api/watches/slug/:slug
```

Use this for frontend product detail pages.

Example:

```txt
GET /api/watches/slug/casio-classic-silver
```

### Featured Watches

```txt
GET /api/watches/featured
```

Returns published, active watches where `isFeatured` is `true`.

### New Arrivals

```txt
GET /api/watches/new-arrivals
```

Returns published, active watches sorted by newest `createdAt`.

### Best Sellers

```txt
GET /api/watches/best-sellers
```

Returns published, active watches sorted by `salesCount`.

Until order logic is added, many products may have `salesCount: 0`.

## Admin API

Admin routes manage product data. They require:

```txt
Authorization: Bearer <jwt>
```

### Create Watch

```txt
POST /api/watches
```

Creates a new product.

Example body:

```json
{
  "name": "Casio Classic Silver",
  "slug": "casio-classic-silver",
  "brand": "Casio",
  "description": "A reliable classic analog watch with a stainless steel case.",
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

### Update Watch

```txt
PUT /api/watches/:id
```

Updates watch fields.

Example:

```json
{
  "price": 11900,
  "stockQuantity": 4,
  "isFeatured": false
}
```

### Update Stock

```txt
PATCH /api/watches/:id/stock
```

Use this when admin only changes stock.

Example:

```json
{
  "stockQuantity": 0
}
```

The backend returns the watch with:

```json
{
  "stockQuantity": 0,
  "inStock": false
}
```

### Publish Or Unpublish

```txt
PATCH /api/watches/:id/publish
```

Example:

```json
{
  "isPublished": false
}
```

When `isPublished` is `false`, customers cannot see the product from public routes.

### Soft Delete

```txt
DELETE /api/watches/:id
```

This does not permanently delete the document.

It changes:

```json
{
  "deletedAt": "current date",
  "isPublished": false
}
```

Why soft delete is used:

- Product history stays in the database.
- Future orders can still reference old products.
- Admin can potentially restore deleted products later.

## Error Behavior

Common errors:

Missing required fields:

```txt
400 validation error
```

Invalid MongoDB ID:

```json
{
  "message": "Invalid resource id"
}
```

Watch not found:

```json
{
  "message": "Watch not found"
}
```

Invalid stock value:

```json
{
  "message": "stockQuantity must be a non-negative integer"
}
```

Invalid publish value:

```json
{
  "message": "isPublished must be true or false"
}
```

Admin auth errors:

```txt
401 Authentication required
401 Invalid or expired token
403 Admin access required
```

## Example Workflows

### Customer Opens Product Listing Page

```txt
Frontend calls GET /api/watches?page=1&limit=12
  -> route calls getWatches
  -> controller builds published filter
  -> MongoDB returns matching watches
  -> response includes watches and pagination
```

### Customer Opens Product Detail Page

```txt
Frontend calls GET /api/watches/slug/casio-classic-silver
  -> route calls getWatchBySlug
  -> controller searches by slug, isPublished true, deletedAt null
  -> backend returns one watch or 404
```

### Admin Creates A Product

```txt
Admin frontend sends POST /api/watches with Bearer token
  -> protect verifies token and loads user
  -> adminOnly checks role
  -> createWatch calls Watch.create
  -> model validates required fields
  -> model derives thumbnail and inStock
  -> MongoDB stores product
  -> backend returns created watch
```

### Admin Changes Stock

```txt
Admin frontend sends PATCH /api/watches/:id/stock
  -> protect verifies token and loads user
  -> adminOnly checks role
  -> controller validates stockQuantity
  -> model updates stockQuantity and inStock
  -> backend returns updated watch
```

### Admin Deletes Product

```txt
Admin frontend sends DELETE /api/watches/:id
  -> protect verifies token and loads user
  -> adminOnly checks role
  -> controller sets deletedAt and isPublished false
  -> product stays in MongoDB
  -> public routes stop showing it
```

## Development Workflow

When changing the Watch feature, follow this order:

1. Change `src/models/Watch.js` if the database structure changes.
2. Change `src/controllers/watchController.js` if API behavior changes.
3. Change `src/routes/watchRoutes.js` if a URL changes or a new endpoint is added.
4. Add middleware only if access control or request processing changes.
5. Update this guide so future work stays understandable.

Run quick syntax checks:

```txt
node --check src/models/Watch.js
node --check src/models/User.js
node --check src/controllers/authController.js
node --check src/controllers/watchController.js
node --check src/routes/authRoutes.js
node --check src/routes/watchRoutes.js
node --check src/middleware/authMiddleware.js
```

Start the backend:

```txt
npm run dev
```

Manual testing order:

1. Test `GET /api/health`.
2. Test public watch list.
3. Test public slug route.
4. Test admin create with token.
5. Test stock update.
6. Test publish/unpublish.
7. Test soft delete.
8. Confirm deleted/unpublished watches do not appear in public routes.

## Frontend Usage Guide

Product listing:

```txt
GET /api/watches?page=1&limit=12
```

Search:

```txt
GET /api/watches?search=casio
```

Category page:

```txt
GET /api/watches?category=men
```

Price filter:

```txt
GET /api/watches?minPrice=5000&maxPrice=25000
```

Sort:

```txt
GET /api/watches?sort=price_asc
GET /api/watches?sort=price_desc
GET /api/watches?sort=newest
```

Product detail:

```txt
GET /api/watches/slug/casio-classic-silver
```

Homepage sections:

```txt
GET /api/watches/featured
GET /api/watches/new-arrivals
GET /api/watches/best-sellers
```

Admin product form:

```txt
POST /api/watches
PUT /api/watches/:id
PATCH /api/watches/:id/stock
PATCH /api/watches/:id/publish
DELETE /api/watches/:id
```

Admin requests must include the Bearer token.

## Important Rules

- Public routes must always filter by `isPublished: true` and `deletedAt: null`.
- The frontend should not set `inStock`; backend derives it from `stockQuantity`.
- Use `slug` for user-friendly product detail URLs.
- Keep `slug` unique.
- Keep `sku` unique.
- Use `PATCH /stock` for stock-only changes.
- Use `PATCH /publish` for publish/unpublish changes.
- Use soft delete instead of permanent delete.
- Increase `salesCount` from order logic after checkout is implemented.
- Keep route order specific-first, dynamic-last.

## Simple Mental Model

```txt
server.js
  turns the backend on

app.js
  prepares Express

routes
  choose the controller

controller
  decides what database action to perform

model
  defines and validates product data

MongoDB
  stores the watches
```
