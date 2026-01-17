# 🏗️ Project Restructuring Plan

## Current Structure
```
IIT KGP/
├── backend/
│   ├── routes/, services/, etc.
│   └── more/  ← Frontend files are here!
└── .env
```

## Target Structure
```
proptoken-iitkgp/
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── cron/
│   ├── contracts/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Steps to Reorganize

### 1. Move Frontend Files
```bash
# Move 'more' folder to 'frontend'
move backend\more ..\frontend
```

### 2. Update Frontend API Configuration
- Update API base URL to point to backend (port 3003)
- Configure CORS
- Set up environment variables

### 3. Update Backend CORS
- Allow frontend origin
- Configure for development and production

### 4. Create Root Configuration
- Root .gitignore
- Root README.md
- Root package.json (optional monorepo)

---

## Executing Now...
