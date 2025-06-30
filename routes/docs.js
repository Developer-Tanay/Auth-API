const express = require("express");
const router = express.Router();

// API Documentation Route
router.get("/", (req, res) => {
  // Check if client wants HTML documentation
  if (req.headers.accept && req.headers.accept.includes("text/html")) {
    return res.send(generateHTMLDocs());
  }

  // Return JSON documentation
  const apiDocs = {
    title: "Authentication Microservice API Documentation",
    version: "1.0.0",
    description:
      "Complete API documentation for the Authentication Microservice with implementation examples",
    baseUrl:
      process.env.NODE_ENV === "production"
        ? "https://your-vercel-app.vercel.app"
        : "http://localhost:3000",

    authentication: {
      overview:
        "This API uses API Key authentication for all endpoints and JWT tokens for protected user endpoints",
      apiKey: {
        header: "x-api-key",
        required: "All endpoints require a valid API key",
        testKeys: ["dev_api_key_123", "test_api_key_456", "admin_api_key_789"],
      },
      jwt: {
        header: "Authorization: Bearer <token>",
        description: "JWT tokens are required for protected user endpoints",
        expiry: {
          accessToken: "15 minutes",
          refreshToken: "7 days",
        },
      },
    },

    endpoints: [
      {
        group: "Health Check",
        endpoints: [
          {
            method: "GET",
            path: "/healthz",
            description: "Public health check endpoint",
            authentication: "None required",
            response: {
              success: true,
              message: "Service is healthy",
              timestamp: "2025-06-28T11:49:03.639Z",
              environment: "development",
            },
            examples: {
              curl: `curl -X GET ${
                process.env.NODE_ENV === "production"
                  ? "https://your-vercel-app.vercel.app"
                  : "http://localhost:3000"
              }/healthz`,
              javascript: `fetch('${
                process.env.NODE_ENV === "production"
                  ? "https://your-vercel-app.vercel.app"
                  : "http://localhost:3000"
              }/healthz')
  .then(response => response.json())
  .then(data => console.log(data));`,
              python: `import requests
response = requests.get('${
                process.env.NODE_ENV === "production"
                  ? "https://your-vercel-app.vercel.app"
                  : "http://localhost:3000"
              }/healthz')
print(response.json())`,
              postman: "Set method to GET and URL to /healthz",
            },
          },
          {
            method: "GET",
            path: "/health",
            description: "Protected health check with database status",
            authentication: "API Key required",
            headers: {
              "x-api-key": "dev_api_key_123",
            },
            response: {
              success: true,
              message: "Service is healthy and authenticated",
              timestamp: "2025-06-28T11:49:03.639Z",
              environment: "development",
            },
            examples: {
              curl: `curl -X GET ${
                process.env.NODE_ENV === "production"
                  ? "https://your-vercel-app.vercel.app"
                  : "http://localhost:3000"
              }/health \\
  -H "x-api-key: dev_api_key_123"`,
              javascript: `fetch('${
                process.env.NODE_ENV === "production"
                  ? "https://your-vercel-app.vercel.app"
                  : "http://localhost:3000"
              }/health', {
  headers: {
    'x-api-key': 'dev_api_key_123'
  }
})
.then(response => response.json())
.then(data => console.log(data));`,
              python: `import requests
headers = {'x-api-key': 'dev_api_key_123'}
response = requests.get('${
                process.env.NODE_ENV === "production"
                  ? "https://your-vercel-app.vercel.app"
                  : "http://localhost:3000"
              }/health', headers=headers)
print(response.json())`,
            },
          },
        ],
      },
      {
        group: "Authentication",
        endpoints: [
          {
            method: "POST",
            path: "/auth/register",
            description: "Register a new user account",
            authentication: "API Key required",
            headers: {
              "x-api-key": "dev_api_key_123",
              "Content-Type": "application/json",
            },
            body: {
              email: "user@example.com",
              password: "Password123!",
              name: "John Doe",
              confirmPassword: "Password123!", // Optional but recommended
            },
            validation: {
              email: "Must be a valid email format",
              password:
                "Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character",
              name: "Required, minimum 2 characters",
            },
            response: {
              success: true,
              message:
                "User registered successfully. Please check your email for OTP verification.",
              data: {
                userId: "685fd6bb2ffcdfebcac7b5b5",
                email: "user@example.com",
              },
            },
            examples: {
              curl: `curl -X POST ${
                process.env.NODE_ENV === "production"
                  ? "https://your-vercel-app.vercel.app"
                  : "http://localhost:3000"
              }/auth/register \\
  -H "x-api-key: dev_api_key_123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "Password123!",
    "name": "John Doe"
  }'`,
              javascript: `fetch('${
                process.env.NODE_ENV === "production"
                  ? "https://your-vercel-app.vercel.app"
                  : "http://localhost:3000"
              }/auth/register', {
  method: 'POST',
  headers: {
    'x-api-key': 'dev_api_key_123',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'Password123!',
    name: 'John Doe'
  })
})
.then(response => response.json())
.then(data => console.log(data));`,
              python: `import requests
import json

headers = {
    'x-api-key': 'dev_api_key_123',
    'Content-Type': 'application/json'
}
data = {
    'email': 'user@example.com',
    'password': 'Password123!',
    'name': 'John Doe'
}
response = requests.post('${
                process.env.NODE_ENV === "production"
                  ? "https://your-vercel-app.vercel.app"
                  : "http://localhost:3000"
              }/auth/register', 
                        headers=headers, json=data)
print(response.json())`,
              react: `const registerUser = async () => {
  try {
    const response = await fetch('${
      process.env.NODE_ENV === "production"
        ? "https://your-vercel-app.vercel.app"
        : "http://localhost:3000"
    }/auth/register', {
      method: 'POST',
      headers: {
        'x-api-key': 'dev_api_key_123',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        name: formData.name
      })
    });
    const data = await response.json();
    if (data.success) {
      // Redirect to OTP verification
    }
  } catch (error) {
    console.error('Registration failed:', error);
  }
};`,
            },
          },
          {
            method: "POST",
            path: "/auth/verify-otp",
            description: "Verify email with OTP code",
            authentication: "API Key required",
            headers: {
              "x-api-key": "dev_api_key_123",
              "Content-Type": "application/json",
            },
            body: {
              email: "user@example.com",
              otp: "123456",
            },
            response: {
              success: true,
              message: "Email verified successfully. You can now login.",
              data: {
                userId: "685fd6bb2ffcdfebcac7b5b5",
                email: "user@example.com",
                verified: true,
              },
            },
            examples: {
              curl: `curl -X POST ${
                process.env.NODE_ENV === "production"
                  ? "https://your-vercel-app.vercel.app"
                  : "http://localhost:3000"
              }/auth/verify-otp \\
  -H "x-api-key: dev_api_key_123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'`,
              javascript: `fetch('${
                process.env.NODE_ENV === "production"
                  ? "https://your-vercel-app.vercel.app"
                  : "http://localhost:3000"
              }/auth/verify-otp', {
  method: 'POST',
  headers: {
    'x-api-key': 'dev_api_key_123',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    otp: '123456'
  })
})
.then(response => response.json())
.then(data => console.log(data));`,
            },
          },
          {
            method: "POST",
            path: "/auth/login",
            description: "Login with email and password",
            authentication: "API Key required",
            headers: {
              "x-api-key": "dev_api_key_123",
              "Content-Type": "application/json",
            },
            body: {
              email: "user@example.com",
              password: "Password123!",
            },
            response: {
              success: true,
              message: "Login successful",
              data: {
                user: {
                  _id: "685fd6bb2ffcdfebcac7b5b5",
                  email: "user@example.com",
                  verified: true,
                  role: "user",
                  createdAt: "2025-06-28T11:49:15.063Z",
                },
                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
            },
            examples: {
              curl: `curl -X POST ${
                process.env.NODE_ENV === "production"
                  ? "https://your-vercel-app.vercel.app"
                  : "http://localhost:3000"
              }/auth/login \\
  -H "x-api-key: dev_api_key_123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'`,
              javascript: `fetch('${
                process.env.NODE_ENV === "production"
                  ? "https://your-vercel-app.vercel.app"
                  : "http://localhost:3000"
              }/auth/login', {
  method: 'POST',
  headers: {
    'x-api-key': 'dev_api_key_123',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'Password123!'
  })
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
  }
});`,
            },
          },
        ],
      },
      {
        group: "Protected User Endpoints",
        description: "These endpoints require both API Key and JWT token",
        endpoints: [
          {
            method: "GET",
            path: "/auth/profile",
            description: "Get current user profile",
            authentication: "API Key + JWT Token required",
            headers: {
              "x-api-key": "dev_api_key_123",
              Authorization: "Bearer <access_token>",
            },
            response: {
              success: true,
              message: "Profile retrieved successfully",
              data: {
                user: {
                  _id: "685fd6bb2ffcdfebcac7b5b5",
                  email: "user@example.com",
                  verified: true,
                  role: "user",
                  createdAt: "2025-06-28T11:49:15.063Z",
                },
              },
            },
            examples: {
              curl: `curl -X GET ${
                process.env.NODE_ENV === "production"
                  ? "https://your-vercel-app.vercel.app"
                  : "http://localhost:3000"
              }/auth/profile \\
  -H "x-api-key: dev_api_key_123" \\
  -H "Authorization: Bearer <access_token>"`,
              javascript: `const accessToken = localStorage.getItem('accessToken');
fetch('${
                process.env.NODE_ENV === "production"
                  ? "https://your-vercel-app.vercel.app"
                  : "http://localhost:3000"
              }/auth/profile', {
  headers: {
    'x-api-key': 'dev_api_key_123',
    'Authorization': \`Bearer \${accessToken}\`
  }
})
.then(response => response.json())
.then(data => console.log(data));`,
            },
          },
          {
            method: "DELETE",
            path: "/auth/account",
            description: "Delete current user account",
            authentication: "API Key + JWT Token required",
            headers: {
              "x-api-key": "dev_api_key_123",
              Authorization: "Bearer <access_token>",
            },
            response: {
              success: true,
              message: "Account deleted successfully",
            },
            examples: {
              curl: `curl -X DELETE ${
                process.env.NODE_ENV === "production"
                  ? "https://your-vercel-app.vercel.app"
                  : "http://localhost:3000"
              }/auth/account \\
  -H "x-api-key: dev_api_key_123" \\
  -H "Authorization: Bearer <access_token>"`,
              javascript: `const accessToken = localStorage.getItem('accessToken');
fetch('${
                process.env.NODE_ENV === "production"
                  ? "https://your-vercel-app.vercel.app"
                  : "http://localhost:3000"
              }/auth/account', {
  method: 'DELETE',
  headers: {
    'x-api-key': 'dev_api_key_123',
    'Authorization': \`Bearer \${accessToken}\`
  }
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Redirect to login
  }
});`,
            },
          },
        ],
      },
      {
        group: "Admin Endpoints",
        description: "These endpoints require admin role",
        endpoints: [
          {
            method: "GET",
            path: "/auth/admin/users",
            description: "Get all users (Admin only)",
            authentication: "API Key + Admin JWT Token required",
            headers: {
              "x-api-key": "dev_api_key_123",
              Authorization: "Bearer <admin_access_token>",
            },
            response: {
              success: true,
              message: "Users retrieved successfully",
              data: {
                users: [
                  {
                    _id: "685fd6bb2ffcdfebcac7b5b5",
                    email: "user@example.com",
                    verified: true,
                    role: "user",
                  },
                ],
                total: 1,
              },
            },
          },
          {
            method: "DELETE",
            path: "/auth/admin/users/:userId",
            description: "Delete any user by ID (Admin only)",
            authentication: "API Key + Admin JWT Token required",
            headers: {
              "x-api-key": "dev_api_key_123",
              Authorization: "Bearer <admin_access_token>",
            },
            parameters: {
              userId: "User ID to delete",
            },
            response: {
              success: true,
              message: "User deleted successfully",
            },
          },
        ],
      },
    ],

    errorCodes: {
      400: "Bad Request - Invalid input data",
      401: "Unauthorized - Missing or invalid API key/token",
      403: "Forbidden - Insufficient permissions",
      404: "Not Found - Resource not found",
      422: "Unprocessable Entity - Validation failed",
      429: "Too Many Requests - Rate limit exceeded",
      500: "Internal Server Error - Server error",
    },

    integrationGuides: {
      frontend: {
        react: {
          title: "React Integration",
          steps: [
            "Install axios or use fetch for HTTP requests",
            "Create an API service file to handle authentication",
            "Store tokens in localStorage or secure storage",
            "Implement token refresh logic",
            "Create protected routes that check authentication",
          ],
          example: `// api/auth.js
const API_BASE = '${
            process.env.NODE_ENV === "production"
              ? "https://your-vercel-app.vercel.app"
              : "http://localhost:3000"
          }';
const API_KEY = 'dev_api_key_123';

export const authAPI = {
  register: async (userData) => {
    const response = await fetch(\`\${API_BASE}/auth/register\`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  },
  
  login: async (credentials) => {
    const response = await fetch(\`\${API_BASE}/auth/login\`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },
  
  getProfile: async () => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(\`\${API_BASE}/auth/profile\`, {
      headers: {
        'x-api-key': API_KEY,
        'Authorization': \`Bearer \${token}\`
      }
    });
    return response.json();
  }
};`,
        },
        vue: {
          title: "Vue.js Integration",
          steps: [
            "Use axios as HTTP client",
            "Create Vuex store for authentication state",
            "Implement route guards for protected pages",
            "Use interceptors for automatic token attachment",
          ],
        },
        angular: {
          title: "Angular Integration",
          steps: [
            "Create AuthService with HttpClient",
            "Implement AuthGuard for route protection",
            "Use interceptors for API key and token injection",
            "Store tokens in Angular services or local storage",
          ],
        },
      },
      mobile: {
        reactNative: {
          title: "React Native Integration",
          steps: [
            "Use AsyncStorage for secure token storage",
            "Implement biometric authentication if needed",
            "Handle network errors and offline scenarios",
            "Use React Navigation for protected screens",
          ],
        },
        flutter: {
          title: "Flutter Integration",
          steps: [
            "Use http package for API calls",
            "Implement secure storage for tokens",
            "Create authentication provider",
            "Handle navigation and protected routes",
          ],
        },
      },
      backend: {
        nodejs: {
          title: "Node.js Backend Integration",
          steps: [
            "Use axios or node-fetch for HTTP requests",
            "Implement middleware for API key validation",
            "Create authentication service class",
            "Handle JWT token verification",
          ],
        },
        python: {
          title: "Python Backend Integration",
          example: `import requests
import json

class AuthService:
    def __init__(self, base_url, api_key):
        self.base_url = base_url
        self.api_key = api_key
        self.headers = {'x-api-key': api_key}
    
    def register_user(self, email, password, name):
        url = f"{self.base_url}/auth/register"
        data = {"email": email, "password": password, "name": name}
        response = requests.post(url, headers=self.headers, json=data)
        return response.json()
    
    def login(self, email, password):
        url = f"{self.base_url}/auth/login"
        data = {"email": email, "password": password}
        response = requests.post(url, headers=self.headers, json=data)
        return response.json()`,
        },
      },
    },

    rateLimiting: {
      general: "15 requests per minute per IP",
      authentication: "5 login attempts per 15 minutes per IP",
      registration: "3 registration attempts per hour per IP",
    },

    security: {
      headers: "API responses include security headers (CORS, CSP, etc.)",
      encryption: "Passwords are hashed using bcrypt",
      tokens: "JWT tokens are signed with secure secrets",
      validation: "All inputs are validated and sanitized",
    },

    deployment: {
      vercel: {
        title: "Vercel Deployment",
        steps: [
          "Connect GitHub repository to Vercel",
          "Set environment variables in Vercel dashboard",
          "Configure custom domain (optional)",
          "Enable automatic deployments",
        ],
        environmentVariables: [
          "MONGODB_URI",
          "JWT_SECRET",
          "JWT_REFRESH_SECRET",
          "API_KEYS",
          "EMAIL_USER",
          "EMAIL_PASS",
        ],
      },
    },
  };

  res.json(apiDocs);
});

// Generate HTML documentation
function generateHTMLDocs() {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://your-vercel-app.vercel.app"
      : "http://localhost:3000";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Authentication Microservice API Documentation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: rgba(255, 255, 255, 0.95);
            padding: 2rem;
            border-radius: 15px;
            margin-bottom: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
        }
        
        h1 {
            color: #2c3e50;
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }
        
        .subtitle {
            color: #7f8c8d;
            font-size: 1.2rem;
            margin-bottom: 1rem;
        }
        
        .base-url {
            background: #e8f5e8;
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid #27ae60;
            font-family: monospace;
            font-size: 1.1rem;
        }
        
        .section {
            background: rgba(255, 255, 255, 0.95);
            margin-bottom: 2rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            overflow: hidden;
        }
        
        .section-header {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 1.5rem;
            font-size: 1.5rem;
            font-weight: 600;
        }
        
        .section-content {
            padding: 2rem;
        }
        
        .endpoint {
            margin-bottom: 2rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid #eee;
        }
        
        .endpoint:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        
        .endpoint-title {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .method {
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-weight: bold;
            margin-right: 1rem;
            font-size: 0.9rem;
        }
        
        .method.GET { background: #e8f5e8; color: #27ae60; }
        .method.POST { background: #e3f2fd; color: #2196f3; }
        .method.DELETE { background: #ffebee; color: #f44336; }
        
        .path {
            font-family: monospace;
            background: #f8f9fa;
            padding: 0.3rem 0.8rem;
            border-radius: 5px;
            font-size: 1.1rem;
            font-weight: 500;
        }
        
        .description {
            color: #666;
            margin-bottom: 1rem;
        }
        
        .auth-badge {
            display: inline-block;
            background: #fff3cd;
            color: #856404;
            padding: 0.3rem 0.8rem;
            border-radius: 15px;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        
        .code-block {
            background: #2d3748;
            color: #e2e8f0;
            padding: 1.5rem;
            border-radius: 8px;
            overflow-x: auto;
            margin: 1rem 0;
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 0.95rem;
            line-height: 1.5;
        }
        
        .tabs {
            display: flex;
            margin-bottom: 1rem;
            border-bottom: 2px solid #eee;
        }
        
        .tab {
            padding: 0.8rem 1.5rem;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            color: #666;
            border-bottom: 2px solid transparent;
            transition: all 0.3s ease;
        }
        
        .tab.active {
            color: #667eea;
            border-bottom-color: #667eea;
            font-weight: 600;
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block !important;
        }
        
        .auth-info {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            margin-bottom: 2rem;
        }
        
        .highlight {
            background: #fff3cd;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: monospace;
        }
        
        .response-example {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            margin-top: 1rem;
        }
        
        .response-title {
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #2c3e50;
        }
        
        .integration-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
        }
        
        .integration-card {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .integration-title {
            font-weight: 600;
            margin-bottom: 1rem;
            color: #2c3e50;
        }
        
        .step-list {
            list-style: none;
            counter-reset: step-counter;
        }
        
        .step-list li {
            counter-increment: step-counter;
            margin-bottom: 0.5rem;
            padding-left: 2rem;
            position: relative;
        }
        
        .step-list li::before {
            content: counter(step-counter);
            position: absolute;
            left: 0;
            top: 0;
            background: #667eea;
            color: white;
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: bold;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            h1 {
                font-size: 2rem;
            }
            
            .endpoint-title {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .method {
                margin-bottom: 0.5rem;
            }
            
            .integration-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Authentication Microservice</h1>
            <div class="subtitle">Complete API Documentation with Implementation Examples</div>
            <div class="base-url">
                <strong>Base URL:</strong> ${baseUrl}
            </div>
            <button onclick="testJS()" style="margin-top: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                🧪 Test JavaScript
            </button>
        </div>

        <!-- Authentication Info -->
        <div class="section">
            <div class="section-header">🔑 Authentication</div>
            <div class="section-content">
                <div class="auth-info">
                    <h3>API Key Authentication</h3>
                    <p>All endpoints require a valid API key in the <span class="highlight">x-api-key</span> header.</p>
                    <p><strong>Test API Keys:</strong> <span class="highlight">dev_api_key_123</span>, <span class="highlight">test_api_key_456</span>, <span class="highlight">admin_api_key_789</span></p>
                </div>
                
                <div class="auth-info">
                    <h3>JWT Token Authentication</h3>
                    <p>Protected user endpoints also require a JWT token in the <span class="highlight">Authorization: Bearer &lt;token&gt;</span> header.</p>
                    <p><strong>Token Expiry:</strong> Access Token (15 minutes), Refresh Token (7 days)</p>
                </div>
            </div>
        </div>

        <!-- Health Check Endpoints -->
        <div class="section">
            <div class="section-header">❤️ Health Check</div>
            <div class="section-content">
                <div class="endpoint">
                    <div class="endpoint-title">
                        <span class="method GET">GET</span>
                        <span class="path">/healthz</span>
                    </div>
                    <div class="description">Public health check endpoint - no authentication required</div>
                    
                    <div class="tabs">
                        <button class="tab active" onclick="showTab(event, 'healthz-curl')">cURL</button>
                        <button class="tab" onclick="showTab(event, 'healthz-js')">JavaScript</button>
                        <button class="tab" onclick="showTab(event, 'healthz-python')">Python</button>
                    </div>
                    
                    <div id="healthz-curl" class="tab-content active">
                        <div class="code-block">curl -X GET ${baseUrl}/healthz</div>
                    </div>
                    
                    <div id="healthz-js" class="tab-content">
                        <div class="code-block">fetch('${baseUrl}/healthz')
  .then(response => response.json())
  .then(data => console.log(data));</div>
                    </div>
                    
                    <div id="healthz-python" class="tab-content">
                        <div class="code-block">import requests
response = requests.get('${baseUrl}/healthz')
print(response.json())</div>
                    </div>
                    
                    <div class="response-example">
                        <div class="response-title">Response:</div>
                        <div class="code-block">{
  "success": true,
  "message": "Service is healthy",
  "timestamp": "2025-06-28T11:49:03.639Z",
  "environment": "development"
}</div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-title">
                        <span class="method GET">GET</span>
                        <span class="path">/health</span>
                    </div>
                    <div class="description">Protected health check with database status</div>
                    <div class="auth-badge">🔑 API Key Required</div>
                    
                    <div class="tabs">
                        <button class="tab active" onclick="showTab(event, 'health-curl')">cURL</button>
                        <button class="tab" onclick="showTab(event, 'health-js')">JavaScript</button>
                    </div>
                    
                    <div id="health-curl" class="tab-content active">
                        <div class="code-block">curl -X GET ${baseUrl}/health \\
  -H "x-api-key: dev_api_key_123"</div>
                    </div>
                    
                    <div id="health-js" class="tab-content">
                        <div class="code-block">fetch('${baseUrl}/health', {
  headers: {
    'x-api-key': 'dev_api_key_123'
  }
})
.then(response => response.json())
.then(data => console.log(data));</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Authentication Endpoints -->
        <div class="section">
            <div class="section-header">🔐 Authentication</div>
            <div class="section-content">
                <div class="endpoint">
                    <div class="endpoint-title">
                        <span class="method POST">POST</span>
                        <span class="path">/auth/register</span>
                    </div>
                    <div class="description">Register a new user account</div>
                    <div class="auth-badge">🔑 API Key Required</div>
                    
                    <div class="tabs">
                        <button class="tab active" onclick="showTab(event, 'register-curl')">cURL</button>
                        <button class="tab" onclick="showTab(event, 'register-js')">JavaScript</button>
                        <button class="tab" onclick="showTab(event, 'register-react')">React</button>
                    </div>
                    
                    <div id="register-curl" class="tab-content active">
                        <div class="code-block">curl -X POST ${baseUrl}/auth/register \\
  -H "x-api-key: dev_api_key_123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "Password123!",
    "name": "John Doe"
  }'</div>
                    </div>
                    
                    <div id="register-js" class="tab-content">
                        <div class="code-block">fetch('${baseUrl}/auth/register', {
  method: 'POST',
  headers: {
    'x-api-key': 'dev_api_key_123',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'Password123!',
    name: 'John Doe'
  })
})
.then(response => response.json())
.then(data => console.log(data));</div>
                    </div>
                    
                    <div id="register-react" class="tab-content">
                        <div class="code-block">const registerUser = async (formData) => {
  try {
    const response = await fetch('${baseUrl}/auth/register', {
      method: 'POST',
      headers: {
        'x-api-key': 'dev_api_key_123',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    if (data.success) {
      // Redirect to OTP verification
      navigate('/verify-otp');
    }
  } catch (error) {
    console.error('Registration failed:', error);
  }
};</div>
                    </div>
                    
                    <div class="response-example">
                        <div class="response-title">Requirements:</div>
                        <ul>
                            <li><strong>Email:</strong> Valid email format</li>
                            <li><strong>Password:</strong> Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char</li>
                            <li><strong>Name:</strong> Min 2 characters</li>
                        </ul>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-title">
                        <span class="method POST">POST</span>
                        <span class="path">/auth/verify-otp</span>
                    </div>
                    <div class="description">Verify email with OTP code</div>
                    <div class="auth-badge">🔑 API Key Required</div>
                    
                    <div class="code-block">curl -X POST ${baseUrl}/auth/verify-otp \\
  -H "x-api-key: dev_api_key_123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'</div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-title">
                        <span class="method POST">POST</span>
                        <span class="path">/auth/login</span>
                    </div>
                    <div class="description">Login with email and password</div>
                    <div class="auth-badge">🔑 API Key Required</div>
                    
                    <div class="code-block">curl -X POST ${baseUrl}/auth/login \\
  -H "x-api-key: dev_api_key_123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'</div>
                    
                    <div class="response-example">
                        <div class="response-title">Response includes:</div>
                        <ul>
                            <li>User information</li>
                            <li>Access Token (15 min expiry)</li>
                            <li>Refresh Token (7 day expiry)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Protected Endpoints -->
        <div class="section">
            <div class="section-header">🛡️ Protected User Endpoints</div>
            <div class="section-content">
                <div class="endpoint">
                    <div class="endpoint-title">
                        <span class="method GET">GET</span>
                        <span class="path">/auth/profile</span>
                    </div>
                    <div class="description">Get current user profile</div>
                    <div class="auth-badge">🔑 API Key + JWT Token Required</div>
                    
                    <div class="code-block">curl -X GET ${baseUrl}/auth/profile \\
  -H "x-api-key: dev_api_key_123" \\
  -H "Authorization: Bearer &lt;access_token&gt;"</div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-title">
                        <span class="method DELETE">DELETE</span>
                        <span class="path">/auth/account</span>
                    </div>
                    <div class="description">Delete current user account</div>
                    <div class="auth-badge">🔑 API Key + JWT Token Required</div>
                    
                    <div class="code-block">curl -X DELETE ${baseUrl}/auth/account \\
  -H "x-api-key: dev_api_key_123" \\
  -H "Authorization: Bearer &lt;access_token&gt;"</div>
                </div>
            </div>
        </div>

        <!-- Integration Guides -->
        <div class="section">
            <div class="section-header">🔧 Integration Guides</div>
            <div class="section-content">
                <div class="integration-grid">
                    <div class="integration-card">
                        <div class="integration-title">React Integration</div>
                        <ol class="step-list">
                            <li>Install axios or use fetch for HTTP requests</li>
                            <li>Create an API service file to handle authentication</li>
                            <li>Store tokens in localStorage or secure storage</li>
                            <li>Implement token refresh logic</li>
                            <li>Create protected routes that check authentication</li>
                        </ol>
                    </div>
                    
                    <div class="integration-card">
                        <div class="integration-title">Node.js Backend</div>
                        <ol class="step-list">
                            <li>Use axios or node-fetch for HTTP requests</li>
                            <li>Implement middleware for API key validation</li>
                            <li>Create authentication service class</li>
                            <li>Handle JWT token verification</li>
                        </ol>
                    </div>
                    
                    <div class="integration-card">
                        <div class="integration-title">Mobile Apps</div>
                        <ol class="step-list">
                            <li>Use secure storage for tokens</li>
                            <li>Implement biometric authentication if needed</li>
                            <li>Handle network errors and offline scenarios</li>
                            <li>Use appropriate navigation for protected screens</li>
                        </ol>
                    </div>
                    
                    <div class="integration-card">
                        <div class="integration-title">Security Best Practices</div>
                        <ol class="step-list">
                            <li>Always use HTTPS in production</li>
                            <li>Store API keys securely (environment variables)</li>
                            <li>Implement proper token refresh logic</li>
                            <li>Handle rate limiting gracefully</li>
                            <li>Validate all user inputs on frontend</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error Codes -->
        <div class="section">
            <div class="section-header">⚠️ Error Codes</div>
            <div class="section-content">
                <div class="response-example">
                    <ul>
                        <li><strong>400:</strong> Bad Request - Invalid input data</li>
                        <li><strong>401:</strong> Unauthorized - Missing or invalid API key/token</li>
                        <li><strong>403:</strong> Forbidden - Insufficient permissions</li>
                        <li><strong>404:</strong> Not Found - Resource not found</li>
                        <li><strong>422:</strong> Unprocessable Entity - Validation failed</li>
                        <li><strong>429:</strong> Too Many Requests - Rate limit exceeded</li>
                        <li><strong>500:</strong> Internal Server Error - Server error</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Rate Limiting -->
        <div class="section">
            <div class="section-header">⏱️ Rate Limiting</div>
            <div class="section-content">
                <div class="response-example">
                    <ul>
                        <li><strong>General:</strong> 15 requests per minute per IP</li>
                        <li><strong>Authentication:</strong> 5 login attempts per 15 minutes per IP</li>
                        <li><strong>Registration:</strong> 3 registration attempts per hour per IP</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <script>
        console.log('Documentation page loaded');
        
        // Simple global function for tab switching
        function showTab(event, tabId) {
            console.log('showTab called with:', tabId);
            
            try {
                // Prevent default behavior
                if (event) {
                    event.preventDefault();
                }
                
                // Find the closest endpoint section
                let section = event.target.closest('.endpoint');
                if (!section) {
                    console.error('Could not find endpoint section');
                    return;
                }
                
                console.log('Found section:', section);
                
                // Hide all tab contents in this section
                const tabContents = section.querySelectorAll('.tab-content');
                const tabs = section.querySelectorAll('.tab');
                
                console.log('Found', tabContents.length, 'tab contents and', tabs.length, 'tabs');
                
                // Remove active class from all tabs and contents in this section
                tabContents.forEach(function(content) {
                    content.classList.remove('active');
                    content.style.display = 'none';
                });
                
                tabs.forEach(function(tab) {
                    tab.classList.remove('active');
                });
                
                // Show selected tab
                const targetTab = document.getElementById(tabId);
                if (targetTab) {
                    targetTab.classList.add('active');
                    targetTab.style.display = 'block';
                    event.target.classList.add('active');
                    console.log('Successfully switched to tab:', tabId);
                } else {
                    console.error('Could not find tab with ID:', tabId);
                }
            } catch (error) {
                console.error('Error in showTab:', error);
            }
        }
        
        // Make sure the function is globally available
        window.showTab = showTab;
        
        // Test function
        function testJS() {
            alert('JavaScript is working!');
        }
        window.testJS = testJS;
        
        console.log('JavaScript functions initialized');
    </script>
</body>
</html>
  `;
}

module.exports = router;
