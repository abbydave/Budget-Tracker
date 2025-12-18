# FinanceFlow API DOCUMENTATION

## Base URL
```
https://budget-tracker-nithub.onrender.com/api
```

---

## Auth

### 1. Register User
**Endpoint:** `POST /auth/register`

**Description:** Register a new user account

**Request Body:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required, valid email format)",
  "password": "string (required, minimum 6 characters recommended)"
}
```

**Response (201 - Created):**
```json
{
  "message": "Registered Successfuly",
  "success": true,
  "data": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "token": "string (JWT token valid for 30 days)"
  }
}
```

**Error Responses:**
- `422 Unprocessable Entity` - Missing required fields
```json
{
  "message": "All fields required",
  "success": false,
  "data": null
}
```

- `409 Conflict` - User already exists
```json
{
  "message": "User already exists, login instead",
  "success": false,
  "data": null
}
```

- `500 Internal Server Error`
```json
{
  "message": "error details",
  "success": false,
  "data": null
}
```

---

### 2. Login User
**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "string (required, valid email format)",
  "password": "string (required)"
}
```

**Response (201 - Created):**
```json
{
  "message": "Sucessfully Logged In",
  "success": true,
  "data": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "token": "string (JWT token valid for 30 days)"
  }
}
```

**Error Responses:**
- `422 Unprocessable Entity` - Missing required fields
```json
{
  "message": "All fields required",
  "success": false,
  "data": null
}
```

- `409 Conflict` - User does not exist
```json
{
  "message": "User does not exist, Register!",
  "success": false,
  "data": null
}
```

- `401 Unauthorized` - Invalid password
```json
{
  "message": "Invalid password!",
  "success": false,
  "data": null
}
```

- `500 Internal Server Error`

---

### 3. Request OTP
**Endpoint:** `POST /auth/request-otp`

**Description:** Request an OTP (One-Time Password) for password reset. OTP is valid for 15 minutes.

**Request Body:**
```json
{
  "email": "string (required, valid email format)"
}
```

**Response (200 - OK):**
```json
{
  "message": "Email sent successfully",
  "success": true,
  "data": null
}
```

**Error Responses:**
- `404 Not Found` - User not found
```json
{
  "message": "User not found",
  "success": false,
  "data": null
}
```

- `500 Internal Server Error`

---

### 4. Reset Password
**Endpoint:** `PUT /auth/password-reset`

**Description:** Reset user password using OTP

**Request Body:**
```json
{
  "email": "string (required, valid email format)",
  "otp": "string (required, 6-digit code sent to email)",
  "password": "string (required, minimum 6 characters recommended)"
}
```

**Response (200 - OK):**
```json
{
  "message": "Password successfully updated",
  "success": true,
  "data": null
}
```

**Error Responses:**
- `422 Unprocessable Entity` - Missing required fields
```json
{
  "message": "All fields required",
  "success": false,
  "data": null
}
```

- `404 Not Found` - User not found
```json
{
  "message": "User not found",
  "success": false,
  "data": null
}
```

- `401 Unauthorized` - Invalid OTP or OTP expired
```json
{
  "message": "Invalid OTP" or "OTP has expired",
  "success": false,
  "data": null
}
```

- `500 Internal Server Error`

---

## Profile

### 1. Get User Profile
**Endpoint:** `GET /profile`

**Description:** Retrieve the authenticated user's profile information

**Authentication:** Required (JWT token in Authorization header)

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (200 - OK):**
```json
{
  "message": "Retrieved successfuly",
  "success": true,
  "data": {
    "firstName": "string",
    "lastName": "string",
    "email": "string"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
```json
{
  "error": "Unauthorized"
}
```

- `400 Bad Request` - User does not exist
```json
{
  "message": "User does not exist",
  "success": false,
  "data": null
}
```

- `500 Internal Server Error`
```json
{
  "message": "error details",
  "success": false,
  "data": null
}
```

---

### 2. Update User Profile
**Endpoint:** `PUT /profile`

**Description:** Update the authenticated user's profile information

**Authentication:** Required (JWT token in Authorization header)

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required, valid email format)"
}
```

**Response (200 - OK):**
```json
{
  "message": "Updated successfuly",
  "success": true,
  "data": {
    "firstName": "string",
    "lastName": "string",
    "email": "string"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token, or user does not exist
```json
{
  "error": "Unauthorized"
}
```
or
```json
{
  "message": "User does not exist",
  "success": false,
  "data": null
}
```

- `422 Unprocessable Entity` - Missing required fields
```json
{
  "message": "All fields required",
  "success": false,
  "data": null
}
```

- `500 Internal Server Error`
```json
{
  "message": "error details",
  "success": false,
  "data": null
}
```

---

## Category

### 1. Create Category
**Endpoint:** `POST /categories`

**Description:** Create a new expense or income category

**Authentication:** Required (JWT token in Authorization header)

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "string (required, unique per user per type, e.g., 'Groceries', 'Salary')",
  "type": "string (required, enum: 'expense' | 'income')"
}
```

**Response (201 - Created):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "string (MongoDB ObjectId)",
    "userId": "string (MongoDB ObjectId)",
    "name": "string",
    "type": "string (expense | income)",
    "createdAt": "string (ISO 8601 date)",
    "updatedAt": "string (ISO 8601 date)"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
```json
{
  "error": "Unauthorized"
}
```

- `422 Unprocessable Entity` - Missing required fields
```json
{
  "success": false,
  "message": "Name and type are required",
  "data": null
}
```

- `409 Conflict` - Category already exists
```json
{
  "success": false,
  "message": "Category already exists",
  "data": null
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "error details",
  "data": null
}
```

---

### 2. Get All Categories
**Endpoint:** `GET /categories`

**Description:** Retrieve all categories for the authenticated user. Optionally filter by type.

**Authentication:** Required (JWT token in Authorization header)

**Request Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
type (optional): string (enum: 'expense' | 'income')
```

**Example Requests:**
```
GET /categories
GET /categories?type=expense
GET /categories?type=income
```

**Response (200 - OK):**
```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "id": "string (MongoDB ObjectId)",
      "userId": "string (MongoDB ObjectId)",
      "name": "string",
      "type": "string (expense | income)",
      "createdAt": "string (ISO 8601 date)",
      "updatedAt": "string (ISO 8601 date)"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
```json
{
  "error": "Unauthorized"
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "error details",
  "data": null
}
```

---

### 3. Update Category
**Endpoint:** `PATCH /categories/:id`

**Description:** Update an existing category. Can update name and/or type. If type is changed, all associated transactions will be updated.

**Authentication:** Required (JWT token in Authorization header)

**Request Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
id: string (MongoDB ObjectId of the category)
```

**Request Body:**
```json
{
  "name": "string (optional)",
  "type": "string (optional, enum: 'expense' | 'income')"
}
```

**Response (200 - OK):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": "string (MongoDB ObjectId)",
    "userId": "string (MongoDB ObjectId)",
    "name": "string",
    "type": "string (expense | income)",
    "createdAt": "string (ISO 8601 date)",
    "updatedAt": "string (ISO 8601 date)"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
```json
{
  "error": "Unauthorized"
}
```

- `404 Not Found` - Category not found
```json
{
  "success": false,
  "message": "Category not found",
  "data": null
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "error details",
  "data": null
}
```

---

### 4. Delete Category
**Endpoint:** `DELETE /categories/:id`

**Description:** Delete a category. Category can only be deleted if it has no associated transactions.

**Authentication:** Required (JWT token in Authorization header)

**Request Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
id: string (MongoDB ObjectId of the category)
```

**Response (200 - OK):**
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": null
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
```json
{
  "error": "Unauthorized"
}
```

- `404 Not Found` - Category not found
```json
{
  "success": false,
  "message": "Category not found",
  "data": null
}
```

- `400 Bad Request` - Category is in use
```json
{
  "success": false,
  "message": "Category is in use and cannot be deleted",
  "data": null
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "error details",
  "data": null
}
```

---

## Transaction

### 1. Create Transaction
**Endpoint:** `POST /transactions`

**Description:** Create a new transaction (expense or income). Transaction type must match the category type.

**Authentication:** Required (JWT token in Authorization header)

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "categoryId": "string (required, MongoDB ObjectId of existing user category)",
  "type": "string (required, enum: 'expense' | 'income')",
  "amount": "number (required, positive number)",
  "date": "string (required, ISO 8601 date format, e.g., '2025-03-15T10:30:00Z')",
  "note": "string (optional, transaction description)"
}
```

**Response (201 - Created):**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "id": "string (MongoDB ObjectId)",
    "userId": "string (MongoDB ObjectId)",
    "categoryId": "string (MongoDB ObjectId)",
    "type": "string (expense | income)",
    "amount": "number",
    "note": "string",
    "date": "string (ISO 8601 date)",
    "createdAt": "string (ISO 8601 date)"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
```json
{
  "error": "Unauthorized"
}
```

- `422 Unprocessable Entity` - Missing required fields
```json
{
  "success": false,
  "message": "All fields required",
  "data": null
}
```

- `400 Bad Request` - Category not found or validation error
```json
{
  "success": false,
  "message": "Category not found or does not belong to user"
}
```
or
```json
{
  "success": false,
  "message": "Transaction type (expense) must match category type (income)"
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "error details",
  "data": null
}
```

---

### 2. Get All Transactions
**Endpoint:** `GET /transactions`

**Description:** Retrieve all transactions for the authenticated user. Optionally filter by date range, type, or category.

**Authentication:** Required (JWT token in Authorization header)

**Request Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
startDate (optional): string (ISO 8601 date format, e.g., '2025-03-01T00:00:00Z')
endDate (optional): string (ISO 8601 date format, e.g., '2025-03-31T23:59:59Z')
type (optional): string (enum: 'expense' | 'income')
categoryId (optional): string (MongoDB ObjectId of category)
```

**Example Requests:**
```
GET /transactions
GET /transactions?startDate=2025-03-01T00:00:00Z&endDate=2025-03-31T23:59:59Z
GET /transactions?type=expense
GET /transactions?categoryId=507f1f77bcf86cd799439011
GET /transactions?type=income&startDate=2025-03-01T00:00:00Z
```

**Response (200 - OK):**
```json
{
  "success": true,
  "message": "Transactions fetched successfully",
  "data": [
    {
      "id": "string (MongoDB ObjectId)",
      "userId": "string (MongoDB ObjectId)",
      "categoryId": {
        "id": "string (MongoDB ObjectId)",
        "name": "string",
        "type": "string (expense | income)"
      },
      "type": "string (expense | income)",
      "amount": "number",
      "note": "string",
      "date": "string (ISO 8601 date)",
      "createdAt": "string (ISO 8601 date)"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
```json
{
  "error": "Unauthorized"
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "error details",
  "data": null
}
```

---

### 3. Update Transaction
**Endpoint:** `PUT /transactions/:id`

**Description:** Update an existing transaction. Can update amount, note, date, category, and type.

**Authentication:** Required (JWT token in Authorization header)

**Request Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
id: string (MongoDB ObjectId of the transaction)
```

**Request Body:**
```json
{
  "amount": "number (optional)",
  "note": "string (optional)",
  "date": "string (optional, ISO 8601 date format)",
  "categoryId": "string (optional, MongoDB ObjectId of category)",
  "type": "string (optional, enum: 'expense' | 'income')"
}
```

**Response (200 - OK):**
```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "data": {
    "id": "string (MongoDB ObjectId)",
    "userId": "string (MongoDB ObjectId)",
    "categoryId": {
      "id": "string (MongoDB ObjectId)",
      "name": "string",
      "type": "string (expense | income)"
    },
    "type": "string (expense | income)",
    "amount": "number",
    "note": "string",
    "date": "string (ISO 8601 date)",
    "createdAt": "string (ISO 8601 date)"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
```json
{
  "error": "Unauthorized"
}
```

- `404 Not Found` - Transaction not found
```json
{
  "success": false,
  "message": "Transaction not found",
  "data": null
}
```

- `400 Bad Request` - Category validation error
```json
{
  "success": false,
  "message": "Category not found or does not belong to user",
  "data": null
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "error details",
  "data": null
}
```

---

### 4. Delete Transaction
**Endpoint:** `DELETE /transactions/:id`

**Description:** Delete a transaction

**Authentication:** Required (JWT token in Authorization header)

**Request Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
id: string (MongoDB ObjectId of the transaction)
```

**Response (200 - OK):**
```json
{
  "success": true,
  "message": "Transaction deleted successfully",
  "data": null
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
```json
{
  "error": "Unauthorized"
}
```

- `404 Not Found` - Transaction not found
```json
{
  "success": false,
  "message": "Transaction not found",
  "data": null
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "error details",
  "data": null
}
```

---

## Budget

### 1. Create or Update Budget
**Endpoint:** `POST /budgets`

**Description:** Create a new budget or update an existing budget for a specific month. Uses upsert logic (creates if doesn't exist, updates if it does).

**Authentication:** Required (JWT token in Authorization header)

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "month": "string (required, format: 'YYYY-MM', e.g., '2025-03')",
  "limit": "number (required, positive number representing budget limit)"
}
```

**Response (201 - Created):**
```json
{
  "success": true,
  "message": "Budget saved successfully",
  "data": {
    "id": "string (MongoDB ObjectId)",
    "userId": "string (MongoDB ObjectId)",
    "month": "string (format: YYYY-MM)",
    "limit": "number"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
```json
{
  "error": "Unauthorized"
}
```

- `400 Bad Request` - Missing required fields
```json
{
  "success": false,
  "message": "Missing required fields",
  "data": null
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "error details",
  "data": null
}
```

---

### 2. Get Budgets by Month
**Endpoint:** `GET /budgets/:month`

**Description:** Retrieve budget(s) for a specific month. Returns all budgets for the authenticated user in the specified month.

**Authentication:** Required (JWT token in Authorization header)

**Request Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
month: string (required, format: 'YYYY-MM', e.g., '2025-03')
```

**Response (200 - OK):**
```json
{
  "success": true,
  "message": "Budgets fetched successfully",
  "data": [
    {
      "id": "string (MongoDB ObjectId)",
      "userId": "string (MongoDB ObjectId)",
      "month": "string (format: YYYY-MM)",
      "limit": "number"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
```json
{
  "error": "Unauthorized"
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "error details",
  "data": null
}
```

---

### 3. Delete Budget
**Endpoint:** `DELETE /budgets/:id`

**Description:** Delete a budget by ID

**Authentication:** Required (JWT token in Authorization header)

**Request Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
```
id: string (required, MongoDB ObjectId of the budget)
```

**Response (200 - OK):**
```json
{
  "success": true,
  "message": "Budget deleted successfully",
  "data": null
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
```json
{
  "error": "Unauthorized"
}
```

- `404 Not Found` - Budget not found
```json
{
  "success": false,
  "message": "Budget not found",
  "data": null
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "error details",
  "data": null
}
```

---

## Dashboard

### 1. Get Monthly Summary
**Endpoint:** `GET /dashboard/summary`

**Description:** Get income, expense, and balance summary for a specific month

**Authentication:** Required (JWT token in Authorization header)

**Request Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
month (required): string (format: 'YYYY-MM', e.g., '2025-03')
```

**Example Request:**
```
GET /dashboard/summary?month=2025-03
```

**Response (200 - OK):**
```json
{
  "success": true,
  "message": "Summary fetched successfully",
  "data": {
    "totalIncome": "number",
    "totalExpense": "number",
    "balance": "number"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
```json
{
  "error": "Unauthorized"
}
```

- `400 Bad Request` - Missing required month parameter
```json
{
  "success": false,
  "message": "Month is required",
  "data": null
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "error details",
  "data": null
}
```

---

### 2. Get Category Breakdown
**Endpoint:** `GET /dashboard/categories`

**Description:** Get spending or income breakdown by category for a specific month

**Authentication:** Required (JWT token in Authorization header)

**Request Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
month (required): string (format: 'YYYY-MM', e.g., '2025-03')
type (required): string (enum: 'expense' | 'income')
```

**Example Requests:**
```
GET /dashboard/categories?month=2025-03&type=expense
GET /dashboard/categories?month=2025-03&type=income
```

**Response (200 - OK):**
```json
{
  "success": true,
  "message": "Category breakdown fetched successfully",
  "data": [
    {
      "id": "string (MongoDB ObjectId of category)",
      "total": "number (amount spent in this category)"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
```json
{
  "error": "Unauthorized"
}
```

- `400 Bad Request` - Missing required parameters
```json
{
  "success": false,
  "message": "Month and type are required",
  "data": null
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "error details",
  "data": null
}
```

---

### 3. Get Spending Trends
**Endpoint:** `GET /dashboard/trends`

**Description:** Get daily spending trends (expenses only) for a date range

**Authentication:** Required (JWT token in Authorization header)

**Request Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
startDate (required): string (ISO 8601 date format, e.g., '2025-03-01T00:00:00Z')
endDate (required): string (ISO 8601 date format, e.g., '2025-03-31T23:59:59Z')
```

**Example Request:**
```
GET /dashboard/trends?startDate=2025-03-01T00:00:00Z&endDate=2025-03-31T23:59:59Z
```

**Response (200 - OK):**
```json
{
  "success": true,
  "message": "Spending trends fetched successfully",
  "data": [
    {
      "id": "string (date in YYYY-MM-DD format)",
      "total": "number (total expenses on this date)"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
```json
{
  "error": "Unauthorized"
}
```

- `400 Bad Request` - Missing required date parameters
```json
{
  "success": false,
  "message": "Start and end dates are required",
  "data": null
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "error details",
  "data": null
}
```