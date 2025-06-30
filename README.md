# Authentication Microservice

A production-ready authentication microservice built with Node.js, Express, and MongoDB. This service provides comprehensive user authentication features including registration, email verification, login, password reset, and user management.

## Features

- 🔐 **User Registration & Email Verification** with OTP
- 🔑 **Secure Login/Logout** with JWT tokens
- 🔄 **Token Refresh** mechanism
- 📧 **Password Reset** via email
- 👤 **User Profile Management**
- 🛡️ **API Key Authentication**
- 🚦 **Rate Limiting**
- 📊 **Request Logging**
- 🔒 **Input Validation & Sanitization**
- 🐳 **Full Docker Support**
- 📚 **API Documentation** with Swagger
- 🧪 **Comprehensive Testing**

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd auth_service
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the services**

   ```bash
   docker-compose up -d
   ```

4. **Verify the setup**
   - Auth Service: http://localhost:3000
   - API Documentation: http://localhost:3000/docs
   - MongoDB Admin: http://localhost:8081 (admin/admin)

## Docker Setup

### Services

- **auth-service**: Main authentication API (Port 3000)
- **mongodb**: MongoDB database (Port 27017)
- **mongo-express**: MongoDB web interface (Port 8081)

### Named Volumes

- `auth_service_mongodb_data`: MongoDB data storage
- `auth_service_mongodb_config`: MongoDB configuration

### Environment Files

- `docker-compose.yml`: Main development setup
- `docker-compose.dev.yml`: Development with additional features
- `docker-compose.prod.yml`: Production optimized

## API Endpoints

### Public Endpoints

| Method | Endpoint                       | Description               |
| ------ | ------------------------------ | ------------------------- |
| POST   | `/auth/register`               | Register new user         |
| POST   | `/auth/verify-otp`             | Verify email with OTP     |
| POST   | `/auth/resend-otp`             | Resend verification OTP   |
| POST   | `/auth/login`                  | User login                |
| POST   | `/auth/refresh-token`          | Refresh access token      |
| POST   | `/auth/request-password-reset` | Request password reset    |
| POST   | `/auth/reset-password`         | Reset password with token |

### Protected Endpoints (Require Authentication)

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| GET    | `/auth/profile`         | Get user profile    |
| PUT    | `/auth/profile`         | Update user profile |
| PUT    | `/auth/change-password` | Change password     |
| POST   | `/auth/logout`          | Logout user         |
| DELETE | `/auth/account`         | Delete user account |

### Admin Endpoints

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| GET    | `/admin/users`     | Get all users     |
| DELETE | `/admin/users/:id` | Delete user by ID |

## Frontend Integration

### React Integration

```javascript
// services/authApi.js
const API_BASE_URL = "http://localhost:3000";
const API_KEY = "your-api-key";

const authApi = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-Key": API_KEY,
      },
    });
    return response.json();
  },
};
```

### Flask Integration

```python
# auth_service.py
import requests
import json

class AuthService:
    def __init__(self, base_url="http://localhost:3000", api_key="your-api-key"):
        self.base_url = base_url
        self.headers = {
            "Content-Type": "application/json",
            "X-API-Key": api_key
        }

    def register(self, user_data):
        response = requests.post(
            f"{self.base_url}/auth/register",
            headers=self.headers,
            json=user_data
        )
        return response.json()

    def login(self, credentials):
        response = requests.post(
            f"{self.base_url}/auth/login",
            headers=self.headers,
            json=credentials
        )
        return response.json()

    def get_profile(self, token):
        headers = {**self.headers, "Authorization": f"Bearer {token}"}
        response = requests.get(
            f"{self.base_url}/auth/profile",
            headers=headers
        )
        return response.json()

# Usage
auth = AuthService()
result = auth.login({"email": "user@example.com", "password": "password123"})
```

### Vue.js Integration

```javascript
// services/auth.js
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";
const API_KEY = "your-api-key";

const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "X-API-Key": API_KEY,
  },
});

// Add token to requests
authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  register: (userData) => authClient.post("/auth/register", userData),
  login: (credentials) => authClient.post("/auth/login", credentials),
  getProfile: () => authClient.get("/auth/profile"),
  updateProfile: (data) => authClient.put("/auth/profile", data),
  logout: () => authClient.post("/auth/logout"),
};
```

### Angular Integration

```typescript
// auth.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:3000";
  private apiKey = "your-api-key";

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/json",
      "X-API-Key": this.apiKey,
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("accessToken");
    return new HttpHeaders({
      "Content-Type": "application/json",
      "X-API-Key": this.apiKey,
      Authorization: `Bearer ${token}`,
    });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData, {
      headers: this.getHeaders(),
    });
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials, {
      headers: this.getHeaders(),
    });
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/profile`, {
      headers: this.getAuthHeaders(),
    });
  }
}
```

### Next.js Integration

```javascript
// lib/auth.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const authService = {
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    return response.json();
  },

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return response.json();
  },

  async getProfile(token) {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return response.json();
  },
};
```

## Configuration

### Environment Variables

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://auth_user:auth_password@mongodb:27017/auth_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_here_min_32_chars
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# OTP Configuration
OTP_SECRET=your_otp_secret_key_here_min_32_chars
OTP_EXPIRE=10

# API Keys
API_KEYS=dev_api_key_1,dev_api_key_2

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Rate Limiting
AUTH_RATE_LIMIT_WINDOW=900000
AUTH_RATE_LIMIT_MAX=10000
PASSWORD_RESET_RATE_LIMIT_WINDOW=3600000
PASSWORD_RESET_RATE_LIMIT_MAX=100
GENERAL_RATE_LIMIT_WINDOW=900000
GENERAL_RATE_LIMIT_MAX=10000

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Development

### Running Tests

```bash
# Run all tests
docker-compose exec auth-service npm test

# Run specific test suite
docker-compose exec auth-service npm run test:auth
docker-compose exec auth-service npm run test:middleware
```

### Accessing Logs

```bash
# View live logs
docker-compose logs -f auth-service

# View MongoDB logs
docker-compose logs -f mongodb
```

### Database Management

```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh auth_db -u auth_user -p auth_password

# Backup database
docker-compose exec mongodb mongodump --uri="mongodb://auth_user:auth_password@localhost:27017/auth_db"

# Restore database
docker-compose exec mongodb mongorestore --uri="mongodb://auth_user:auth_password@localhost:27017/auth_db"
```

## Production Deployment

### Using Production Compose

```bash
# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Scale the auth service
docker-compose -f docker-compose.prod.yml up -d --scale auth-service=3
```

### Security Considerations

1. **Change default passwords** in production
2. **Use strong JWT secrets** (minimum 32 characters)
3. **Configure proper CORS origins**
4. **Set up SSL/TLS** termination
5. **Use environment-specific API keys**
6. **Enable MongoDB authentication**
7. **Configure proper rate limits**

## Troubleshooting

### Common Issues

1. **Connection refused**: Ensure Docker services are running
2. **Invalid API key**: Check API_KEYS in .env file
3. **JWT errors**: Verify JWT_SECRET configuration
4. **Email not sending**: Configure EMAIL\_\* variables
5. **Rate limit exceeded**: Adjust rate limit settings

### Health Checks

- **Service Health**: GET http://localhost:3000/healthz
- **Database Status**: Access MongoDB via Mongo Express
- **Container Status**: `docker-compose ps`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the troubleshooting section above
