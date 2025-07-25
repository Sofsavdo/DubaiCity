
# Admin Panel Deployment Guide

## 1. Yangi Repl yarating
- Template: Node.js  
- Nom: DubaiCity-Admin

## 2. Admin kod larini ko'chiring
```bash
# backup_admin_panel/ ni root ga ko'chiring
cp -r backup_admin_panel/* ./
```

## 3. Package.json sozlang
```json
{
  "name": "dubaicity-admin",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "vite": "^5.4.14",
    "@vitejs/plugin-react": "^4.3.2"
  }
}
```

## 4. Static Deployment
- Build command: `npm run build`
- Public directory: `dist`
