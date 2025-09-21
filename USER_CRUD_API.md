# User CRUD API Documentation

This document describes the full CRUD operations implemented for User management in the Acquisitions API.

## Authentication

All user endpoints require JWT authentication. Include the token in either:
- Cookie: `token=<jwt_token>`
- Authorization header: `Authorization: Bearer <jwt_token>`

## Endpoints

### 1. Get All Users
**GET** `/api/users`

- **Access**: Admin only
- **Description**: Retrieves all users in the system
- **Response**: 
```json
{
  "message": "Successfully retrieved users",
  "users": [...],
  "count": 5
}
```

### 2. Get User By ID
**GET** `/api/users/:id`

- **Access**: Users can view their own info, admins can view any user
- **Parameters**: `id` (integer) - User ID
- **Response**: 
```json
{
  "message": "User retrieved successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Update User
**PUT** `/api/users/:id`

- **Access**: Users can update their own info, admins can update any user
- **Parameters**: `id` (integer) - User ID
- **Body**: 
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "admin"  // Only admins can change roles
}
```
- **Notes**: 
  - At least one field must be provided
  - Only admins can change user roles
  - Email uniqueness is enforced
- **Response**: 
```json
{
  "message": "User updated successfully",
  "user": { ... }
}
```

### 4. Delete User
**DELETE** `/api/users/:id`

- **Access**: Users can delete their own account, admins can delete any user
- **Parameters**: `id` (integer) - User ID
- **Business Rules**:
  - Users can only delete their own accounts
  - Admins can delete any user account
  - Admins cannot delete their own accounts (safety measure)
- **Response**: 
```json
{
  "message": "User deleted successfully",
  "user": {
    "id": 1,
    "email": "deleted@example.com",
    "name": "Deleted User"
  }
}
```

## Error Responses

### Validation Errors (400)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "id",
      "message": "User ID must be a positive integer"
    }
  ]
}
```

### Authentication Required (401)
```json
{
  "error": "Unauthorized",
  "message": "Access token is required"
}
```

### Forbidden Access (403)
```json
{
  "error": "Forbidden",
  "message": "You can only update your own information"
}
```

### User Not Found (404)
```json
{
  "error": "User not found"
}
```

## Implementation Details

### Service Layer (`users.services.js`)
- `getUserById(id)`: Retrieves user by ID with error handling
- `updateUser(id, updates)`: Updates user with timestamp tracking
- `deleteUser(id)`: Safely deletes user with existence check

### Validation Layer (`users.validation.js`)
- `userIdSchema`: Validates user ID parameters
- `updateUserSchema`: Validates update request body with optional fields

### Controller Layer (`users.controller.js`)
- Comprehensive error handling and logging
- Authorization checks for each operation
- Proper HTTP status codes and response formatting

### Security Features
- JWT-based authentication
- Role-based access control
- Input validation with Zod
- SQL injection prevention via ORM
- Comprehensive logging for security auditing