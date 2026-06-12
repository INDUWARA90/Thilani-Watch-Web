<!-- ## 7. Image Uploads (Completed)

### DONE

- Integrated Cloudinary for image storage.
- Configured Multer with Cloudinary storage.
- Implemented image validation (type and size).
- Added routes for uploading multiple images and deleting by public ID.

### Routes

- `POST /api/uploads/watch-images` (Admin only, up to 5 images)
- `DELETE /api/uploads/watch-images` (Admin only)

### Validation

- Only image mimetypes allowed.
- Max file size: 2MB.
- Foldering in Cloudinary: `thilani-watches`.
- Returns both `url` and `publicId` for database storage and future deletion. -->

<!-- <!-- ## 8. Product Reviews And Ratings (Completed)

### DONE

- Implemented `Review` model with automated aggregate rating calculations on the `Watch` model.
- Implemented `reviewController` with ownership checks and admin management.
- Implemented `Wishlist` model with unique constraints.
- Implemented `wishlistController` with automatic filtering of unavailable products.

### Review Routes

- `GET /api/watches/:watchId/reviews` (Public)
- `POST /api/watches/:watchId/reviews` (Auth user, once per watch)
- `PUT /api/reviews/:id` (Review owner or Admin)
- `DELETE /api/reviews/:id` (Review owner or Admin)
- `PATCH /api/reviews/:id/approve` (Admin only)

### Wishlist Routes

- `GET /api/wishlist` (Auth user)
- `POST /api/wishlist/:watchId` (Auth user)
- `DELETE /api/wishlist/:watchId` (Auth user)

### Rules

- Ratings must be 1-5.
- One review per user per watch.
- Wishlist prevents duplicates.
- Unpublished watches are automatically hidden from wishlist views. -->

<!-- ## 10. Categories And Brands (Completed)

### DONE

- Implemented separate collections for `Category` and `Brand`.
- Updated `Watch` model to use `ObjectId` references.
- Added CRUD controllers and routes for management.

### Routes

- `GET /api/categories` & `/api/brands` (Public)
- `POST`, `PUT`, `DELETE` routes (Admin only)

### Fields

- `name`, `slug`, `description`, `imageUrl`, `isActive`, `sortOrder`.

### Notes

- This setup allows the frontend to show category/brand descriptions and logos on listing pages.
- Transitioning existing string data to ObjectIds will require a migration script if there is already data in the DB. -->

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
