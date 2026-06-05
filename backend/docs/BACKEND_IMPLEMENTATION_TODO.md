# Thilani Watch Backend Implementation TODO

## 3. Watch API Improvements

### Current routes

- `GET /api/watches`
- `POST /api/watches`
- `GET /api/watches/:id`
- `PUT /api/watches/:id`
- `DELETE /api/watches/:id`

### TODO

Improve these routes for real ecommerce usage.

### Public customer routes

- `GET /api/watches`
  - Return only published watches.
  - Support pagination.
  - Support sorting.
  - Support searching.
  - Support category, brand, price, stock, and featured filters.

- `GET /api/watches/:id`
  - Return one published watch by MongoDB id.

- `GET /api/watches/slug/:slug`
  - Return one published watch by slug for product detail pages.

- `GET /api/watches/featured`
  - Return watches marked as featured.

- `GET /api/watches/new-arrivals`
  - Return recently created watches.

- `GET /api/watches/best-sellers`
  - Return watches sorted by sales count after order system is added.

### Admin routes

- `POST /api/watches`
  - Admin only.
  - Create a watch.

- `PUT /api/watches/:id`
  - Admin only.
  - Update all watch fields.

- `PATCH /api/watches/:id/stock`
  - Admin only.
  - Update stock quantity and `inStock`.

- `PATCH /api/watches/:id/publish`
  - Admin only.
  - Publish or unpublish a watch.

- `DELETE /api/watches/:id`
  - Admin only.
  - Prefer soft delete instead of permanent delete.

### Query examples

```txt
GET /api/watches?page=1&limit=12
GET /api/watches?search=casio
GET /api/watches?brand=Rolex
GET /api/watches?category=men
GET /api/watches?minPrice=5000&maxPrice=25000
GET /api/watches?sort=price_asc
GET /api/watches?sort=price_desc
GET /api/watches?sort=newest
GET /api/watches?featured=true
```

## 4. Authentication And Authorization

### TODO

Add user authentication before creating admin-only routes.

### Suggested user roles

- `customer`: can browse watches, manage cart, place orders, and write reviews.
- `admin`: can manage watches, orders, customers, and site settings.

### Suggested routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `PUT /api/auth/change-password`

### Suggested user model fields

- `name`
- `email`
- `password`
- `phone`
- `role`
- `isActive`
- `addresses`
- timestamps

### Security requirements

- Hash passwords using `bcrypt`.
- Use JWT authentication.
- Keep JWT secret in `.env`.
- Add `protect` middleware for logged-in users.
- Add `adminOnly` middleware for admin routes.
- Never return password hashes in API responses.

## 5. Cart Backend

### TODO

Decide whether cart data should be stored in the database or only in frontend local storage.

For a better ecommerce backend, create a cart system.

### Suggested cart routes

- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/:watchId`
- `DELETE /api/cart/items/:watchId`
- `DELETE /api/cart`

### Suggested cart model fields

- `user`
- `items`
- `items.watch`
- `items.quantity`
- `items.priceAtTime`
- `subtotal`
- timestamps

### Rules

- Customers should not add unpublished watches.
- Customers should not add more quantity than available stock.
- Cart totals should be recalculated on the backend.
- Store the watch price at the time it was added to the cart.

## 6. Order Management

### TODO

Add order creation and management.

### Suggested customer routes

- `POST /api/orders`
- `GET /api/orders/my-orders`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/cancel`

### Suggested admin routes

- `GET /api/orders`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`
- `PATCH /api/orders/:id/payment-status`

### Suggested order model fields

- `user`
- `items`
- `items.watch`
- `items.name`
- `items.sku`
- `items.quantity`
- `items.price`
- `shippingAddress`
- `billingAddress`
- `paymentMethod`
- `paymentStatus`
- `orderStatus`
- `subtotal`
- `shippingFee`
- `discount`
- `total`
- `notes`
- timestamps

### Suggested order statuses

- `pending`
- `confirmed`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

### Suggested payment statuses

- `pending`
- `paid`
- `failed`
- `refunded`

### Important order rules

- Check stock before creating an order.
- Reduce stock after successful order creation or payment confirmation.
- Prevent customers from viewing other customers' orders.
- Admins should be able to update order status.
- Customers should only cancel orders before shipping.

## 7. Image Uploads

### TODO

Add product image upload support.

### Suggested approach

- Use Cloudinary, S3, or another image storage provider.
- Use `multer` for receiving uploaded files.
- Store only image URLs in MongoDB.
- Add image validation.

### Suggested routes

- `POST /api/uploads/watch-images`
- `DELETE /api/uploads/watch-images`

### Validation rules

- Only allow image files.
- Limit file size.
- Limit number of images per watch.
- Reject unsupported file extensions.

## 8. Product Reviews And Ratings

### TODO

Add customer reviews for watches.

### Suggested routes

- `GET /api/watches/:watchId/reviews`
- `POST /api/watches/:watchId/reviews`
- `PUT /api/reviews/:id`
- `DELETE /api/reviews/:id`

### Suggested review model fields

- `watch`
- `user`
- `rating`
- `title`
- `comment`
- `isApproved`
- timestamps

### Rules

- Only logged-in customers can create reviews.
- A customer should only review the same watch once.
- Rating should be between 1 and 5.
- Admin may approve, hide, or delete reviews.
- Update `ratingAverage` and `ratingCount` on the watch after review changes.

## 9. Wishlist

### TODO

Add a wishlist feature for logged-in customers.

### Suggested routes

- `GET /api/wishlist`
- `POST /api/wishlist/:watchId`
- `DELETE /api/wishlist/:watchId`

### Rules

- Only logged-in customers can use wishlist.
- Prevent duplicate wishlist items.
- Hide or clean up wishlist items for unpublished watches.

## 10. Categories And Brands

### TODO

Decide whether categories and brands should be strings inside the watch model or separate collections.

For a growing store, use separate collections.

### Suggested category routes

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Suggested brand routes

- `GET /api/brands`
- `POST /api/brands`
- `PUT /api/brands/:id`
- `DELETE /api/brands/:id`

### Suggested fields

- `name`
- `slug`
- `description`
- `imageUrl`
- `isActive`
- `sortOrder`
- timestamps

## 11. Search, Filter, Sort, And Pagination

### TODO

Create reusable query helpers for product listing APIs.

### Features to implement

- Text search by name, brand, description, SKU, and category.
- Filter by category.
- Filter by brand.
- Filter by price range.
- Filter by stock status.
- Filter by featured status.
- Filter by published status.
- Sort by newest.
- Sort by price low to high.
- Sort by price high to low.
- Sort by rating.
- Sort by popularity.
- Pagination with `page`, `limit`, `total`, `pages`, and `hasNextPage`.

### Suggested response format

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "pages": 9,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## 12. Request Validation

### TODO

Add validation before controller logic.

### Suggested tools

- `express-validator`
- `joi`
- `zod`

### Validation targets

- Watch create request.
- Watch update request.
- Register request.
- Login request.
- Cart item request.
- Order create request.
- Review create request.

### Why this matters

Mongoose validation protects the database, but request validation gives cleaner API messages and avoids unnecessary database work.

## 13. Error Response Standard

### TODO

Make all API errors follow one structure.

### Suggested format

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "price",
      "message": "Price must be greater than or equal to 0"
    }
  ]
}
```

### Error cases to handle

- Invalid MongoDB id.
- Missing resource.
- Validation error.
- Duplicate key error.
- Unauthorized request.
- Forbidden request.
- Invalid JSON body.
- Unknown server error.

## 14. API Response Standard

### TODO

Make successful responses consistent.

### Suggested format for single item

```json
{
  "success": true,
  "data": {}
}
```

### Suggested format for lists

```json
{
  "success": true,
  "data": [],
  "pagination": {}
}
```

### Why this matters

The frontend becomes easier to build when every response has the same shape.

## 15. Admin Dashboard Backend

### TODO

Add backend endpoints for dashboard summary cards and admin tables.

### Suggested routes

- `GET /api/admin/dashboard`
- `GET /api/admin/sales-summary`
- `GET /api/admin/recent-orders`
- `GET /api/admin/low-stock`

### Suggested dashboard data

- Total revenue.
- Total orders.
- Pending orders.
- Delivered orders.
- Total products.
- Low stock watches.
- Total customers.
- Recent orders.
- Best selling watches.

## 16. Inventory Management

### TODO

Improve stock handling.

### Features

- Track `stockQuantity`.
- Automatically set `inStock` based on stock quantity.
- Add low stock threshold.
- Add admin low stock endpoint.
- Prevent checkout when stock is unavailable.
- Reduce stock after confirmed order.
- Restore stock when order is cancelled before shipping.

## 17. Payment Integration

### TODO

Choose a payment method based on your business needs.

### Possible payment options

- Cash on delivery.
- Bank transfer.
- Card payment through a payment gateway.
- PayHere or another Sri Lanka-supported payment provider.

### Suggested backend features

- Save selected payment method.
- Save payment status.
- Add payment confirmation route.
- Add webhook route if using online payment.
- Verify payment gateway signatures.

## 18. Shipping And Delivery

### TODO

Add shipping calculation and delivery tracking.

### Suggested features

- Store customer shipping address.
- Add delivery fee calculation.
- Support free shipping threshold.
- Store tracking number.
- Store courier name.
- Store estimated delivery date.
- Allow admin to mark order as shipped or delivered.

## 19. Coupons And Discounts

### TODO

Add coupon support if the store needs promotions.

### Suggested coupon model fields

- `code`
- `discountType`: `percentage` or `fixed`
- `discountValue`
- `minimumOrderAmount`
- `maxDiscountAmount`
- `startsAt`
- `expiresAt`
- `usageLimit`
- `usedCount`
- `isActive`

### Suggested routes

- `POST /api/coupons/validate`
- `GET /api/admin/coupons`
- `POST /api/admin/coupons`
- `PUT /api/admin/coupons/:id`
- `DELETE /api/admin/coupons/:id`

## 20. Security Hardening

### TODO

Add common Express security middleware.

### Suggested packages

- `helmet`
- `express-rate-limit`
- `mongo-sanitize`
- `hpp`

### Security work

- Add rate limiting to auth routes.
- Add general API rate limit.
- Sanitize MongoDB query injection characters.
- Set security headers with Helmet.
- Restrict CORS in production.
- Validate uploaded files.
- Hide error stacks in production.
- Use strong JWT secrets.

## 21. Logging

### TODO

Improve logging beyond `console.log`.

### Suggested packages

- `morgan` for HTTP request logs.
- `winston` or `pino` for application logs.

### What to log

- Server startup.
- Database connection success or failure.
- Request method, URL, status, and response time.
- Authentication failures.
- Order creation.
- Payment status changes.
- Unexpected server errors.

## 22. Testing

### TODO

Add automated tests after the main backend features are implemented.

### Suggested packages

- `jest`
- `supertest`
- `mongodb-memory-server`

### Tests to write

- Health endpoint returns OK.
- Watch list endpoint returns watches.
- Watch create validates required fields.
- Watch update handles missing watch.
- Invalid watch id returns 400.
- Register creates a user.
- Login returns a token.
- Customer cannot access admin routes.
- Admin can create watches.
- Cart rejects quantity above stock.
- Order creation reduces stock.
- Review rating must be between 1 and 5.

## 23. Database Seeding

### TODO

Create seed scripts for local development.

### Suggested scripts

- `npm run seed`
- `npm run seed:destroy`

### Seed data to include

- Admin user.
- Customer user.
- Watch categories.
- Watch brands.
- 20 to 50 sample watches.
- Sample orders.
- Sample reviews.

## 24. API Documentation

### TODO

Document the API so the frontend can be connected smoothly.

### Suggested options

- Create `API_DOCUMENTATION.md`.
- Add Postman collection.
- Add Swagger/OpenAPI docs.

### Documentation should include

- Endpoint path.
- HTTP method.
- Auth requirement.
- Request body.
- Query parameters.
- Success response.
- Error response.
- Example request.

## 25. Deployment Preparation

### TODO

Prepare backend for production deployment.

### Deployment checklist

- Set `NODE_ENV=production`.
- Use production MongoDB connection string.
- Set production `CLIENT_URL`.
- Set strong `JWT_SECRET`.
- Confirm CORS only allows real frontend domain.
- Confirm uploaded images use external storage.
- Confirm logs do not expose private data.
- Confirm error responses hide stack traces.
- Add production start command.
- Check server health endpoint after deployment.

## 26. Suggested Implementation Order

Follow this order to avoid building features on unstable foundations.

1. Add `.env.example` and improve setup documentation.
2. Expand `Watch` model.
3. Add request validation.
4. Improve watch list filtering, search, sorting, and pagination.
5. Standardize API success and error responses.
6. Add authentication and user roles.
7. Protect admin watch routes.
8. Add image upload support.
9. Add cart.
10. Add orders.
11. Add inventory stock rules.
12. Add reviews and ratings.
13. Add wishlist.
14. Add categories and brands.
15. Add admin dashboard endpoints.
16. Add coupons if needed.
17. Add payment integration.
18. Add shipping and delivery tracking.
19. Add security middleware.
20. Add logging.
21. Add seed scripts.
22. Add automated tests.
23. Add API documentation.
24. Prepare for deployment.

## 27. Minimum Backend Version For First Launch

If you want to launch a simple first version, implement only these items first:

- Expanded watch model.
- Watch listing with search, filter, sort, and pagination.
- Admin authentication.
- Admin-only create, update, delete watches.
- Image upload.
- Basic order creation.
- Stock quantity updates.
- Simple order status management.
- Production `.env` setup.
- Basic API documentation.

## 28. Recommended Folder Structure Later

The current structure is good for a small backend. After adding more features, use this structure:

```txt
src/
  app.js
  config/
    db.js
    env.js
  controllers/
    authController.js
    watchController.js
    cartController.js
    orderController.js
    reviewController.js
    uploadController.js
    adminController.js
  middleware/
    authMiddleware.js
    errorMiddleware.js
    validateMiddleware.js
  models/
    User.js
    Watch.js
    Cart.js
    Order.js
    Review.js
    Category.js
    Brand.js
    Coupon.js
  routes/
    index.js
    authRoutes.js
    watchRoutes.js
    cartRoutes.js
    orderRoutes.js
    reviewRoutes.js
    uploadRoutes.js
    adminRoutes.js
  utils/
    asyncHandler.js
    apiResponse.js
    createToken.js
    slugify.js
  validators/
    authValidators.js
    watchValidators.js
    orderValidators.js
```

## 29. Final Notes

- Keep customer routes and admin routes clearly separated.
- Do not trust frontend prices, stock values, or user roles.
- Always calculate cart and order totals on the backend.
- Always check stock on the backend before creating orders.
- Use soft delete for important business data such as orders and products.
- Add tests especially around authentication, checkout, and stock updates.
