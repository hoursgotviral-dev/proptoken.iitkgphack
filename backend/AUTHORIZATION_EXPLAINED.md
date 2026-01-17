# 🔐 Authorization System - How It Works

## ✅ **YES - Each User Gets Their Own Token**

---

## 📋 **Complete Flow**

### Step 1: Register BUILDER
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"builder@test.com","password":"pass123","role":"BUILDER"}'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "builder@test.com",
    "role": "BUILDER"
  }
}
```

---

### Step 2: Register CLIENT
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"client@test.com","password":"pass123","role":"CLIENT"}'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 2,
    "email": "client@test.com",
    "role": "CLIENT"
  }
}
```

---

### Step 3: BUILDER Login (Gets Token #1)
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"builder@test.com","password":"pass123"}'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkJVSUxERVIiLCJlbWFpbCI6ImJ1aWxkZXJAdGVzdC5jb20iLCJpYXQiOjE3MDU0NzYwMDAsImV4cCI6MTcwNTU2MjQwMH0.BUILDER_SIGNATURE",
  "user": {
    "id": 1,
    "email": "builder@test.com",
    "role": "BUILDER"
  }
}
```

**Token #1 contains:**
- User ID: 1
- Role: BUILDER
- Email: builder@test.com

---

### Step 4: CLIENT Login (Gets Token #2)
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@test.com","password":"pass123"}'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6IkNMSUVOVCIsImVtYWlsIjoiY2xpZW50QHRlc3QuY29tIiwiaWF0IjoxNzA1NDc2MDAwLCJleHAiOjE3MDU1NjI0MDB9.CLIENT_SIGNATURE",
  "user": {
    "id": 2,
    "email": "client@test.com",
    "role": "CLIENT"
  }
}
```

**Token #2 contains:**
- User ID: 2
- Role: CLIENT
- Email: client@test.com

---

## 🔑 **Key Points**

### ✅ **Tokens Are Different**
- Each user gets a **unique token**
- Token includes user ID, role, and email
- Tokens are **NOT interchangeable**

### ✅ **Role-Based Access**

**BUILDER Token allows:**
```bash
# ✅ Create assets
POST /assets (with BUILDER token)

# ✅ Tokenize assets
POST /assets/:id/tokenize (with BUILDER token)

# ✅ View my assets
GET /assets/my-assets (with BUILDER token)

# ❌ Cannot buy tokens (they own the asset)
```

**CLIENT Token allows:**
```bash
# ✅ Buy tokens
POST /assets/:id/buy (with CLIENT token)

# ✅ Swap tokens
POST /swap (with CLIENT token)

# ✅ Lock collateral
POST /collateral/lock (with CLIENT token)

# ❌ Cannot create assets
# ❌ Cannot tokenize assets
```

---

## 🧪 **Test It Yourself**

### 1. Register Both Users
```bash
# BUILDER
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"mybuilder@test.com","password":"pass123","role":"BUILDER"}'

# CLIENT
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"myclient@test.com","password":"pass123","role":"CLIENT"}'
```

### 2. Login Both Users
```bash
# BUILDER Login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mybuilder@test.com","password":"pass123"}'
# Save this token as BUILDER_TOKEN

# CLIENT Login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"myclient@test.com","password":"pass123"}'
# Save this token as CLIENT_TOKEN
```

### 3. Test BUILDER Creates Asset
```bash
curl -X POST http://localhost:4000/assets \
  -H "Authorization: Bearer BUILDER_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Property","description":"Demo","location":"Mumbai","valuation":5000000}'
```

**Result**: ✅ Success (BUILDER can create)

### 4. Test CLIENT Tries to Create Asset
```bash
curl -X POST http://localhost:4000/assets \
  -H "Authorization: Bearer CLIENT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","description":"Test","location":"Test","valuation":1000000}'
```

**Result**: ❌ Error: "Access denied. Insufficient permissions."

---

## 📊 **Summary**

| Question | Answer |
|----------|--------|
| Are tokens different? | ✅ YES - Each user gets unique token |
| One token for BUILDER? | ✅ YES - Generated on login |
| One token for CLIENT? | ✅ YES - Generated on login |
| Can tokens be reused? | ✅ YES - Valid for 24 hours |
| Are roles enforced? | ✅ YES - Middleware checks role |
| Can CLIENT create assets? | ❌ NO - Access denied |
| Can BUILDER buy tokens? | ❌ NO - They own the asset |

---

## 🎯 **In Your System**

**When you register:**
- BUILDER user → Gets BUILDER token on login
- CLIENT user → Gets CLIENT token on login

**Each token:**
- Is unique
- Contains user info
- Expires in 24 hours
- Enforces role-based access

**Perfect for:**
- Multi-user systems
- Role-based permissions
- Secure API access
- Audit trails

---

## ✅ **Your Authorization System is Production-Ready!**

- JWT tokens ✅
- Role-based access ✅
- Secure authentication ✅
- Token expiration ✅
- Middleware protection ✅
