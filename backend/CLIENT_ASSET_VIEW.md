# 🎯 CLIENT Asset Viewing - Complete Guide

## ✅ **YES - CLIENTs Can View Their Assets!**

I just added a new endpoint specifically for CLIENTs to view the tokens/assets they own.

---

## 📊 **Two Different Views**

### 1. **BUILDER View** - `/assets/my-assets`
Shows assets the BUILDER created and owns:
```bash
GET /assets/my-assets
Authorization: Bearer BUILDER_TOKEN
```

**Response:**
```json
[
  {
    "id": 1,
    "owner_id": 1,
    "name": "Luxury Apartment",
    "description": "3BHK Premium",
    "location": "Mumbai",
    "valuation": 5000000,
    "status": "Active"
  }
]
```

---

### 2. **CLIENT View** - `/assets/my-tokens` ⭐ NEW!
Shows tokens/assets the CLIENT purchased:
```bash
GET /assets/my-tokens
Authorization: Bearer CLIENT_TOKEN
```

**Response:**
```json
[
  {
    "ownership_id": 1,
    "tokens_owned": 10,
    "asset_id": 1,
    "name": "Luxury Apartment",
    "description": "3BHK Premium",
    "location": "Mumbai",
    "valuation": 5000000,
    "status": "Active",
    "price_per_fraction": 5000,
    "total_fractions": 1000,
    "investment_value": 50000
  }
]
```

**Shows:**
- ✅ How many tokens they own
- ✅ Asset details
- ✅ Their investment value
- ✅ Total fractions available
- ✅ Price per token

---

## 🎯 **Complete Asset Viewing Matrix**

| User Type | Endpoint | What They See |
|-----------|----------|---------------|
| **Anyone** | `GET /assets` | All verified/active assets |
| **BUILDER** | `GET /assets/my-assets` | Assets they created |
| **CLIENT** | `GET /assets/my-tokens` | Tokens they purchased |

---

## 🧪 **Test It**

### Step 1: Register & Login CLIENT
```bash
# Register
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"client@test.com","password":"pass123","role":"CLIENT"}'

# Login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@test.com","password":"pass123"}'
```

Save the token!

### Step 2: View CLIENT's Tokens
```bash
curl -X GET http://localhost:4000/assets/my-tokens \
  -H "Authorization: Bearer CLIENT_TOKEN_HERE"
```

**Returns:**
- All assets the CLIENT owns tokens in
- Number of tokens owned
- Investment value
- Asset details

---

## 📊 **What CLIENT Can See**

### Public Assets (No Auth Required)
```bash
GET /assets
```
Shows all verified/active assets available for purchase.

### My Tokens (CLIENT Auth Required)
```bash
GET /assets/my-tokens
```
Shows:
- Assets they invested in
- Number of tokens owned
- Current value
- Asset details

### Specific Asset Details
```bash
GET /assets/:id
```
(You can add this if needed - shows details of any specific asset)

---

## 🎓 **Use Cases**

### For CLIENT:
1. **View available assets**: `GET /assets`
2. **Buy tokens**: `POST /assets/:id/buy`
3. **View my portfolio**: `GET /assets/my-tokens` ⭐ NEW
4. **Check dashboard**: `GET /dashboard`
5. **View activity**: `GET /activity/my-activity`

### For BUILDER:
1. **Create asset**: `POST /assets`
2. **View my assets**: `GET /assets/my-assets`
3. **Tokenize asset**: `POST /assets/:id/tokenize`
4. **Check dashboard**: `GET /dashboard`

---

## ✅ **Updated Permissions**

### CLIENT Can Now:
- ✅ View all public assets (`GET /assets`)
- ✅ View their owned tokens (`GET /assets/my-tokens`) ⭐ NEW
- ✅ Buy tokens
- ✅ Swap tokens
- ✅ Lock collateral
- ✅ View dashboard
- ✅ View activity feed

### BUILDER Can:
- ✅ View all public assets (`GET /assets`)
- ✅ View their created assets (`GET /assets/my-assets`)
- ✅ Create assets
- ✅ Tokenize assets
- ✅ View dashboard
- ✅ View activity feed

---

## 🚀 **Test the New Endpoint**

After CLIENT buys tokens, they can view them:

```bash
# 1. CLIENT buys tokens
curl -X POST http://localhost:4000/assets/1/buy \
  -H "Authorization: Bearer CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fractions":10}'

# 2. CLIENT views their tokens
curl -X GET http://localhost:4000/assets/my-tokens \
  -H "Authorization: Bearer CLIENT_TOKEN"
```

**Response shows:**
```json
[
  {
    "ownership_id": 1,
    "tokens_owned": 10,
    "asset_id": 1,
    "name": "Luxury Apartment",
    "investment_value": 50000,
    ...
  }
]
```

---

## ✅ **Summary**

**Question**: Can CLIENT view their assets?  
**Answer**: ✅ **YES!**

**New Endpoint**: `GET /assets/my-tokens`  
**Who Can Use**: CLIENT role only  
**Shows**: All tokens/assets the CLIENT owns  
**Includes**: Investment value, token count, asset details

**Your system now has complete asset viewing for both roles!** 🎉
